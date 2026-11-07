import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { getDb, saveDb } from '../db/database';
import { computeSHA256, computeQuickImageDHash } from './hasher';
import { classifyFile } from './classifier';
import { identifyDuplicateGroups } from './duplicateEngine';
import { getAllLearningRules } from './learningEngine';
import { FileRecord, ScanSession } from '../types';

export async function scanDirectory(options: { rootPath: string; isDemo?: boolean }): Promise<{ scan: ScanSession; files: FileRecord[] }> {
  const rootPath = path.resolve(options.rootPath).replace(/\\/g, '/');
  const scanId = `scan-${Date.now()}`;
  const startTime = new Date().toISOString();

  if (!fs.existsSync(rootPath)) {
    throw new Error(`Directory does not exist: ${rootPath}`);
  }

  const learnedRules = await getAllLearningRules();
  const rawFiles = discoverFiles(rootPath);
  const fileRecords: FileRecord[] = [];

  for (const filePath of rawFiles) {
    try {
      const stats = fs.statSync(filePath);
      const name = path.basename(filePath);
      const ext = path.extname(filePath);
      const mimeType = (mime.lookup(filePath) as string) || 'application/octet-stream';
      const relativePath = path.relative(rootPath, filePath).replace(/\\/g, '/');
      const directory = path.dirname(filePath).replace(/\\/g, '/');

      const sha256 = await computeSHA256(filePath);
      const isImage = mimeType.startsWith('image/');
      const pHash = isImage ? computeQuickImageDHash(filePath) : undefined;

      const classification = classifyFile(name, ext, mimeType, learnedRules);

      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      fileRecords.push({
        id,
        scanId,
        name,
        path: filePath.replace(/\\/g, '/'),
        relativePath,
        directory,
        extension: ext,
        mimeType,
        size: stats.size,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
        category: classification.category,
        subcategory: classification.subcategory,
        confidence: classification.confidence,
        classificationReason: classification.reason,
        sha256,
        pHash,
        tags: classification.tags,
        isDuplicate: false,
      });
    } catch (err) {
      console.warn(`Could not process file: ${filePath}`, err);
    }
  }

  // Duplicate cluster calculation
  const duplicateGroups = identifyDuplicateGroups(fileRecords);
  for (const group of duplicateGroups) {
    for (const groupFile of group.files) {
      const target = fileRecords.find((f) => f.id === groupFile.id);
      if (target) {
        target.isDuplicate = true;
        target.duplicateGroupId = group.id;
        target.similarityScore = group.similarityPercentage;
      }
    }
  }

  // Persist into SQLite
  const db = await getDb();
  const totalSize = fileRecords.reduce((acc, f) => acc + f.size, 0);
  const dupCount = duplicateGroups.reduce((acc, g) => acc + (g.files.length - 1), 0);

  const scanSession: ScanSession = {
    id: scanId,
    rootPath,
    status: 'COMPLETED',
    totalFiles: fileRecords.length,
    totalSize,
    duplicateCount: dupCount,
    startTime,
    endTime: new Date().toISOString(),
    isDemo: !!options.isDemo,
  };

  db.run(
    `INSERT INTO scans (id, root_path, status, total_files, total_size, duplicate_count, start_time, end_time, is_demo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [scanSession.id, scanSession.rootPath, scanSession.status, scanSession.totalFiles, scanSession.totalSize, scanSession.duplicateCount, scanSession.startTime, scanSession.endTime || null, scanSession.isDemo ? 1 : 0]
  );

  // Clear previous active files to avoid stale mix
  db.run(`DELETE FROM files`);

  for (const f of fileRecords) {
    db.run(
      `INSERT INTO files (id, scan_id, name, path, relative_path, directory, extension, mime_type, size, created_at, modified_at, category, subcategory, confidence, classification_reason, sha256, phash, tags, is_duplicate, duplicate_group_id, similarity_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [f.id, f.scanId, f.name, f.path, f.relativePath, f.directory, f.extension, f.mimeType, f.size, f.createdAt, f.modifiedAt, f.category, f.subcategory || null, f.confidence, f.classificationReason, f.sha256, f.pHash || null, JSON.stringify(f.tags), f.isDuplicate ? 1 : 0, f.duplicateGroupId || null, f.similarityScore || null]
    );
  }

  saveDb();
  return { scan: scanSession, files: fileRecords };
}

function discoverFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item.startsWith('.') || item === 'node_modules' || item === '$RECYCLE.BIN') continue;
      const fullPath = path.join(dir, item);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          discoverFiles(fullPath, fileList);
        } else if (stats.isFile()) {
          fileList.push(fullPath);
        }
      } catch {
        // skip unreadable
      }
    }
  } catch {
    // skip unreadable dir
  }
  return fileList;
}

export async function getLatestScanFiles(): Promise<FileRecord[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM files ORDER BY created_at DESC`);
  if (!res || res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row: any[]) => {
    const obj: any = {};
    cols.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return {
      id: obj.id,
      scanId: obj.scan_id,
      name: obj.name,
      path: obj.path,
      relativePath: obj.relative_path,
      directory: obj.directory,
      extension: obj.extension,
      mimeType: obj.mime_type,
      size: obj.size,
      createdAt: obj.created_at,
      modifiedAt: obj.modified_at,
      category: obj.category,
      subcategory: obj.subcategory,
      confidence: obj.confidence,
      classificationReason: obj.classification_reason,
      sha256: obj.sha256,
      pHash: obj.phash,
      tags: obj.tags ? JSON.parse(obj.tags) : [],
      isDuplicate: obj.is_duplicate === 1,
      duplicateGroupId: obj.duplicate_group_id,
      similarityScore: obj.similarity_score,
      suggestedAction: obj.suggested_action,
      suggestedPath: obj.suggested_path,
      suggestedName: obj.suggested_name,
    };
  });
}
