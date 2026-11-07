import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from '../db/database';
import { ActionLog, RecycleItem } from '../types';

const QUARANTINE_DIR = path.join(__dirname, '../../data/.quarantine');

function ensureQuarantineDir() {
  if (!fs.existsSync(QUARANTINE_DIR)) {
    fs.mkdirSync(QUARANTINE_DIR, { recursive: true });
  }
}

export async function executeSafeMove(fileId: string, currentPath: string, targetPath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.renameSync(currentPath, targetPath);

    const db = await getDb();
    const actionId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fileName = path.basename(currentPath);

    db.run(
      `INSERT INTO action_logs (id, timestamp, action_type, file_id, file_name, original_path, new_path, is_reversible, undone, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`,
      [actionId, new Date().toISOString(), 'MOVE', fileId, fileName, currentPath, targetPath, `Moved from ${currentPath} to ${targetPath}`]
    );

    db.run(
      `UPDATE files SET path = ?, directory = ? WHERE id = ?`,
      [targetPath, targetDir, fileId]
    );

    saveDb();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function executeSafeRename(fileId: string, currentPath: string, newName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const dir = path.dirname(currentPath);
    const newPath = path.join(dir, newName).replace(/\\/g, '/');

    fs.renameSync(currentPath, newPath);

    const db = await getDb();
    const actionId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const oldName = path.basename(currentPath);

    db.run(
      `INSERT INTO action_logs (id, timestamp, action_type, file_id, file_name, original_path, new_path, is_reversible, undone, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`,
      [actionId, new Date().toISOString(), 'RENAME', fileId, oldName, currentPath, newPath, `Renamed ${oldName} -> ${newName}`]
    );

    db.run(
      `UPDATE files SET name = ?, path = ? WHERE id = ?`,
      [newName, newPath, fileId]
    );

    saveDb();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function executeSafeRecycle(fileId: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    ensureQuarantineDir();
    const fileName = path.basename(filePath);
    const quarantineFileName = `${Date.now()}_${fileName}`;
    const quarantinePath = path.join(QUARANTINE_DIR, quarantineFileName).replace(/\\/g, '/');

    if (fs.existsSync(filePath)) {
      fs.renameSync(filePath, quarantinePath);
    }

    const db = await getDb();
    const stats = fs.existsSync(quarantinePath) ? fs.statSync(quarantinePath) : { size: 0 };
    const recycleId = `rec-${Date.now()}`;

    db.run(
      `INSERT INTO recycle_bin (id, original_path, quarantine_path, file_name, size, deleted_at, sha256, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [recycleId, filePath, quarantinePath, fileName, stats.size, new Date().toISOString(), 'recycled', 'Documents']
    );

    const actionId = `act-${Date.now()}`;
    db.run(
      `INSERT INTO action_logs (id, timestamp, action_type, file_id, file_name, original_path, new_path, is_reversible, undone, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`,
      [actionId, new Date().toISOString(), 'RECYCLE', fileId, fileName, filePath, quarantinePath, `Quarantined file to ${quarantinePath}`]
    );

    db.run(`DELETE FROM files WHERE id = ?`, [fileId]);

    saveDb();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreRecycleItem(recycleId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    const res = db.exec(`SELECT * FROM recycle_bin WHERE id = '${recycleId}'`);
    if (!res || res.length === 0 || res[0].values.length === 0) {
      return { success: false, error: 'Recycle item not found' };
    }

    const row = res[0].values[0];
    const originalPath = row[1] as string;
    const quarantinePath = row[2] as string;
    const fileName = row[3] as string;

    const parentDir = path.dirname(originalPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    if (fs.existsSync(quarantinePath)) {
      fs.renameSync(quarantinePath, originalPath);
    }

    db.run(`DELETE FROM recycle_bin WHERE id = ?`, [recycleId]);

    const actionId = `act-${Date.now()}`;
    db.run(
      `INSERT INTO action_logs (id, timestamp, action_type, file_id, file_name, original_path, new_path, is_reversible, undone, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?)`,
      [actionId, new Date().toISOString(), 'RESTORE', recycleId, fileName, quarantinePath, originalPath, `Restored file from quarantine to ${originalPath}`]
    );

    saveDb();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function undoAction(actionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    const res = db.exec(`SELECT * FROM action_logs WHERE id = '${actionId}'`);
    if (!res || res.length === 0 || res[0].values.length === 0) {
      return { success: false, error: 'Action log not found' };
    }

    const row = res[0].values[0];
    const actionType = row[2] as string;
    const fileId = row[3] as string;
    const originalPath = row[5] as string;
    const newPath = row[6] as string;
    const undone = row[8] as number;

    if (undone === 1) {
      return { success: false, error: 'Action has already been undone.' };
    }

    if (actionType === 'MOVE' || actionType === 'RENAME') {
      if (newPath && fs.existsSync(newPath)) {
        const origDir = path.dirname(originalPath);
        if (!fs.existsSync(origDir)) {
          fs.mkdirSync(origDir, { recursive: true });
        }
        fs.renameSync(newPath, originalPath);

        db.run(
          `UPDATE files SET path = ?, name = ?, directory = ? WHERE id = ?`,
          [originalPath, path.basename(originalPath), origDir, fileId]
        );
      }
    }

    db.run(`UPDATE action_logs SET undone = 1 WHERE id = ?`, [actionId]);
    saveDb();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getActionLogs(): Promise<ActionLog[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM action_logs ORDER BY timestamp DESC LIMIT 100`);
  if (!res || res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row: any[]) => {
    const obj: any = {};
    cols.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return {
      id: obj.id,
      timestamp: obj.timestamp,
      actionType: obj.action_type,
      fileId: obj.file_id,
      fileName: obj.file_name,
      originalPath: obj.original_path,
      newPath: obj.new_path,
      isReversible: obj.is_reversible === 1,
      undone: obj.undone === 1,
      details: obj.details,
    };
  });
}

export async function recordActionLog(log: {
  actionType: 'MOVE' | 'RENAME' | 'RECYCLE' | 'RESTORE' | 'DELETE';
  fileId: string;
  fileName: string;
  originalPath: string;
  newPath?: string;
  isReversible?: boolean;
  details?: string;
}): Promise<void> {
  const db = await getDb();
  const actionId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  db.run(
    `INSERT INTO action_logs (id, timestamp, action_type, file_id, file_name, original_path, new_path, is_reversible, undone, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    [
      actionId,
      new Date().toISOString(),
      log.actionType,
      log.fileId,
      log.fileName,
      log.originalPath,
      log.newPath || null,
      log.isReversible ? 1 : 0,
      log.details || '',
    ]
  );
  saveDb();
}

export async function getRecycleBinItems(): Promise<RecycleItem[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM recycle_bin ORDER BY deleted_at DESC`);
  if (!res || res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row: any[]) => {
    const obj: any = {};
    cols.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return {
      id: obj.id,
      originalPath: obj.original_path,
      quarantinePath: obj.quarantine_path,
      fileName: obj.file_name,
      size: obj.size,
      deletedAt: obj.deleted_at,
      sha256: obj.sha256,
      category: obj.category,
    };
  });
}


