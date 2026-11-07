import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { computeSHA256 } from './hasher';
import { classifyFile } from './classifier';
import { getUserRootDir, getUserQuarantineDir, getUserVaultDir, verifyVaultPin } from './authService';
import { getDb, saveDb } from '../db/database';
import { FileCategory } from '../types';

export interface FSItem {
  id: string;
  name: string;
  path: string; // Clean Virtual Path (e.g. /Notes, /Project/app.js)
  relativePath: string;
  isDirectory: boolean;
  size: number;
  extension: string;
  mimeType: string;
  createdAt: string;
  modifiedAt: string;
  category: FileCategory;
  itemCount?: number;
}

export interface DirectoryBrowseResult {
  currentPath: string;
  parentPath: string | null;
  rootName: string;
  items: FSItem[];
  totalItems: number;
  totalFolders: number;
  totalFiles: number;
  totalSize: number;
  driveRoots: { name: string; path: string }[];
}

// Resolve & sanitize virtual path strictly inside user's isolated sandbox
export function resolveUserPath(userId: string, virtualPath: string = '/'): { realPath: string; cleanVirtualPath: string } {
  const userRoot = getUserRootDir(userId);

  let normalized = (virtualPath || '/').replace(/\\/g, '/').trim();
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  const segments = normalized.split('/').filter((s) => s && s !== '.' && s !== '..');
  const cleanVirtualPath = '/' + segments.join('/');

  const realPath = path.join(userRoot, ...segments).replace(/\\/g, '/');

  if (!realPath.startsWith(userRoot)) {
    throw new Error('Access denied: Invalid path traversal attempt');
  }

  return { realPath, cleanVirtualPath };
}

// Browse user's sandboxed directory
export async function browseUserDirectory(userId: string, virtualPath: string = '/'): Promise<DirectoryBrowseResult> {
  const { realPath, cleanVirtualPath } = resolveUserPath(userId, virtualPath);

  if (!fs.existsSync(realPath)) {
    return browseUserDirectory(userId, '/');
  }

  const stat = fs.statSync(realPath);
  if (!stat.isDirectory()) {
    return browseUserDirectory(userId, path.dirname(cleanVirtualPath).replace(/\\/g, '/'));
  }

  const parentVirtual = cleanVirtualPath === '/' ? null : (path.dirname(cleanVirtualPath).replace(/\\/g, '/') || '/');
  const rootName = cleanVirtualPath === '/' ? 'My Files' : path.basename(cleanVirtualPath);

  const entries = fs.readdirSync(realPath, { withFileTypes: true });
  const items: FSItem[] = [];
  let totalSize = 0;
  let totalFolders = 0;
  let totalFiles = 0;

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    const itemRealPath = path.join(realPath, entry.name).replace(/\\/g, '/');
    const itemVirtualPath = cleanVirtualPath === '/' ? `/${entry.name}` : `${cleanVirtualPath}/${entry.name}`;

    try {
      const itemStat = fs.statSync(itemRealPath);
      const isDir = itemStat.isDirectory();
      const ext = isDir ? '' : path.extname(entry.name).toLowerCase();
      const mimeType = isDir ? 'inode/directory' : (mime.lookup(entry.name) || 'application/octet-stream');

      let itemCount: number | undefined;
      if (isDir) {
        totalFolders++;
        try {
          itemCount = fs.readdirSync(itemRealPath).filter((n) => !n.startsWith('.')).length;
        } catch {
          itemCount = 0;
        }
      } else {
        totalFiles++;
        totalSize += itemStat.size;
      }

      const classification = isDir
        ? { category: 'Others' as FileCategory }
        : classifyFile(entry.name, ext, mimeType);

      items.push({
        id: itemVirtualPath,
        name: entry.name,
        path: itemVirtualPath,
        relativePath: entry.name,
        isDirectory: isDir,
        size: isDir ? 0 : itemStat.size,
        extension: ext,
        mimeType,
        createdAt: itemStat.birthtime.toISOString(),
        modifiedAt: itemStat.mtime.toISOString(),
        category: isDir ? 'Others' : classification.category,
        itemCount,
      });
    } catch {}
  }

  items.sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return {
    currentPath: cleanVirtualPath,
    parentPath: parentVirtual,
    rootName,
    items,
    totalItems: items.length,
    totalFolders,
    totalFiles,
    totalSize,
    driveRoots: [
      { name: 'My Files', path: '/' },
      { name: 'Documents', path: '/Documents' },
      { name: 'Projects', path: '/Projects' },
      { name: 'Images', path: '/Images' },
    ],
  };
}

// Read user file content
export async function readUserFileContent(userId: string, virtualPath: string): Promise<{
  content: string;
  isBinary: boolean;
  size: number;
  mimeType: string;
  sha256?: string;
}> {
  const { realPath } = resolveUserPath(userId, virtualPath);

  if (!fs.existsSync(realPath)) {
    throw new Error(`File not found: ${virtualPath}`);
  }

  const stat = fs.statSync(realPath);
  if (stat.isDirectory()) {
    throw new Error('Cannot read directory as file');
  }

  const mimeType = mime.lookup(realPath) || 'application/octet-stream';
  const ext = path.extname(realPath).toLowerCase();

  const textExtensions = [
    '.txt', '.md', '.markdown', '.json', '.js', '.jsx', '.ts', '.tsx',
    '.html', '.htm', '.css', '.scss', '.sass', '.less', '.py', '.c',
    '.cpp', '.h', '.hpp', '.cs', '.java', '.go', '.rs', '.php', '.rb',
    '.sh', '.bash', '.bat', '.ps1', '.sql', '.xml', '.yaml', '.yml',
    '.ini', '.env', '.log', '.csv', '.tsv', '.toml', '.svg'
  ];

  const isTextLike = textExtensions.includes(ext) || mimeType.startsWith('text/') || mimeType === 'application/json';

  if (!isTextLike && stat.size > 2 * 1024 * 1024) {
    return {
      content: '',
      isBinary: true,
      size: stat.size,
      mimeType,
    };
  }

  try {
    const buffer = fs.readFileSync(realPath);
    const isBinary = buffer.slice(0, 1000).includes(0);

    if (isBinary) {
      return {
        content: '',
        isBinary: true,
        size: stat.size,
        mimeType,
      };
    }

    const content = buffer.toString('utf-8');
    let sha256 = '';
    try {
      sha256 = await computeSHA256(realPath);
    } catch {
      sha256 = 'unknown';
    }

    return {
      content,
      isBinary: false,
      size: stat.size,
      mimeType,
      sha256,
    };
  } catch (err: any) {
    throw new Error(`Failed to read file: ${err.message}`);
  }
}

// Write/Save user file
export async function writeUserFileContent(userId: string, virtualPath: string, content: string): Promise<{ success: boolean; size: number }> {
  const { realPath } = resolveUserPath(userId, virtualPath);

  fs.mkdirSync(path.dirname(realPath), { recursive: true });
  fs.writeFileSync(realPath, content, 'utf-8');
  const stat = fs.statSync(realPath);

  return { success: true, size: stat.size };
}

// Create new folder
export async function createUserFolder(userId: string, parentVirtualPath: string, folderName: string): Promise<{ success: boolean; path: string }> {
  const sanitized = folderName.trim().replace(/[\\/:*?"<>|]/g, '_');
  if (!sanitized) {
    throw new Error('Invalid folder name');
  }

  const { realPath: parentRealPath, cleanVirtualPath: parentVirtual } = resolveUserPath(userId, parentVirtualPath);
  const targetRealPath = path.join(parentRealPath, sanitized).replace(/\\/g, '/');
  const targetVirtualPath = parentVirtual === '/' ? `/${sanitized}` : `${parentVirtual}/${sanitized}`;

  if (fs.existsSync(targetRealPath)) {
    throw new Error(`Folder "${sanitized}" already exists in this directory`);
  }

  fs.mkdirSync(targetRealPath, { recursive: true });
  return { success: true, path: targetVirtualPath };
}

// Create new file
export async function createUserFile(userId: string, parentVirtualPath: string, fileName: string, initialContent: string = ''): Promise<{ success: boolean; path: string }> {
  const sanitized = fileName.trim().replace(/[\\/:*?"<>|]/g, '_');
  if (!sanitized) {
    throw new Error('Invalid file name');
  }

  const { realPath: parentRealPath, cleanVirtualPath: parentVirtual } = resolveUserPath(userId, parentVirtualPath);
  const targetRealPath = path.join(parentRealPath, sanitized).replace(/\\/g, '/');
  const targetVirtualPath = parentVirtual === '/' ? `/${sanitized}` : `${parentVirtual}/${sanitized}`;

  if (fs.existsSync(targetRealPath)) {
    throw new Error(`File "${sanitized}" already exists in this directory`);
  }

  fs.mkdirSync(path.dirname(targetRealPath), { recursive: true });
  fs.writeFileSync(targetRealPath, initialContent, 'utf-8');
  return { success: true, path: targetVirtualPath };
}

// Rename item
export async function renameUserItem(userId: string, oldVirtualPath: string, newName: string): Promise<{ success: boolean; newPath: string }> {
  const { realPath: oldRealPath, cleanVirtualPath: oldVirtual } = resolveUserPath(userId, oldVirtualPath);

  if (!fs.existsSync(oldRealPath)) {
    throw new Error(`Item not found: ${oldVirtualPath}`);
  }

  const sanitized = newName.trim().replace(/[\\/:*?"<>|]/g, '_');
  if (!sanitized) {
    throw new Error('Invalid name');
  }

  const parentRealPath = path.dirname(oldRealPath);
  const targetRealPath = path.join(parentRealPath, sanitized).replace(/\\/g, '/');
  const parentVirtual = path.dirname(oldVirtual).replace(/\\/g, '/');
  const targetVirtualPath = parentVirtual === '/' ? `/${sanitized}` : `${parentVirtual}/${sanitized}`;

  if (fs.existsSync(targetRealPath) && targetRealPath.toLowerCase() !== oldRealPath.toLowerCase()) {
    throw new Error(`An item named "${sanitized}" already exists in this folder`);
  }

  fs.renameSync(oldRealPath, targetRealPath);
  return { success: true, newPath: targetVirtualPath };
}

// Delete item
export async function deleteUserItem(userId: string, virtualPath: string, permanent: boolean = false): Promise<{ success: boolean; message: string }> {
  const { realPath, cleanVirtualPath } = resolveUserPath(userId, virtualPath);

  if (!fs.existsSync(realPath)) {
    throw new Error(`Item not found: ${virtualPath}`);
  }

  const stat = fs.statSync(realPath);
  const baseName = path.basename(realPath);

  if (permanent || stat.isDirectory()) {
    if (stat.isDirectory()) {
      fs.rmSync(realPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(realPath);
    }
    return { success: true, message: `Permanently deleted ${baseName}` };
  } else {
    const quarantineDir = getUserQuarantineDir(userId);
    const quarantinePath = path.join(quarantineDir, `${Date.now()}_${baseName}`).replace(/\\/g, '/');
    fs.renameSync(realPath, quarantinePath);

    const db = await getDb();
    db.run(
      `INSERT INTO recycle_bin (id, user_id, original_path, quarantine_path, file_name, size, deleted_at, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [`rec_${Date.now()}`, userId, cleanVirtualPath, quarantinePath, baseName, stat.size, new Date().toISOString(), 'Documents']
    );
    saveDb();

    return { success: true, message: `Moved ${baseName} to Recycle Bin` };
  }
}

// Copy item
export async function copyUserItem(userId: string, sourceVirtualPath: string, destVirtualDirPath: string): Promise<{ success: boolean; newPath: string }> {
  const { realPath: sourceRealPath } = resolveUserPath(userId, sourceVirtualPath);
  const { realPath: destRealDirPath, cleanVirtualPath: destVirtualDir } = resolveUserPath(userId, destVirtualDirPath);

  if (!fs.existsSync(sourceRealPath)) {
    throw new Error(`Source not found: ${sourceVirtualPath}`);
  }
  if (!fs.existsSync(destRealDirPath)) {
    fs.mkdirSync(destRealDirPath, { recursive: true });
  }

  const baseName = path.basename(sourceRealPath);
  let targetRealPath = path.join(destRealDirPath, baseName).replace(/\\/g, '/');
  let targetName = baseName;

  if (fs.existsSync(targetRealPath)) {
    const ext = path.extname(baseName);
    const nameWithoutExt = path.basename(baseName, ext);
    let counter = 1;
    while (fs.existsSync(targetRealPath)) {
      targetName = `${nameWithoutExt} (Copy ${counter})${ext}`;
      targetRealPath = path.join(destRealDirPath, targetName).replace(/\\/g, '/');
      counter++;
    }
  }

  const stat = fs.statSync(sourceRealPath);
  if (stat.isDirectory()) {
    fs.cpSync(sourceRealPath, targetRealPath, { recursive: true });
  } else {
    fs.copyFileSync(sourceRealPath, targetRealPath);
  }

  const targetVirtualPath = destVirtualDir === '/' ? `/${targetName}` : `${destVirtualDir}/${targetName}`;
  return { success: true, newPath: targetVirtualPath };
}

// Move item
export async function moveUserItem(userId: string, sourceVirtualPath: string, destVirtualDirPath: string): Promise<{ success: boolean; newPath: string }> {
  const { realPath: sourceRealPath } = resolveUserPath(userId, sourceVirtualPath);
  const { realPath: destRealDirPath, cleanVirtualPath: destVirtualDir } = resolveUserPath(userId, destVirtualDirPath);

  if (!fs.existsSync(sourceRealPath)) {
    throw new Error(`Source not found: ${sourceVirtualPath}`);
  }
  if (!fs.existsSync(destRealDirPath)) {
    fs.mkdirSync(destRealDirPath, { recursive: true });
  }

  const baseName = path.basename(sourceRealPath);
  let targetRealPath = path.join(destRealDirPath, baseName).replace(/\\/g, '/');
  let targetName = baseName;

  if (sourceRealPath.toLowerCase() === targetRealPath.toLowerCase()) {
    return { success: true, newPath: sourceVirtualPath };
  }

  if (fs.existsSync(targetRealPath)) {
    const ext = path.extname(baseName);
    const nameWithoutExt = path.basename(baseName, ext);
    let counter = 1;
    while (fs.existsSync(targetRealPath)) {
      targetName = `${nameWithoutExt} (${counter})${ext}`;
      targetRealPath = path.join(destRealDirPath, targetName).replace(/\\/g, '/');
      counter++;
    }
  }

  fs.renameSync(sourceRealPath, targetRealPath);
  const targetVirtualPath = destVirtualDir === '/' ? `/${targetName}` : `${destVirtualDir}/${targetName}`;
  return { success: true, newPath: targetVirtualPath };
}

// Seed starter demo files
export async function seedUserSandbox(userId: string): Promise<void> {
  const userRoot = getUserRootDir(userId);

  const starterDirs = ['Documents', 'Projects', 'Notes', 'Images'];
  for (const d of starterDirs) {
    fs.mkdirSync(path.join(userRoot, d), { recursive: true });
  }

  fs.writeFileSync(
    path.join(userRoot, 'Notes', 'Welcome_Guide.md'),
    `# Welcome to your Personal Cloud Workspace! 🚀\n\nThis is your private, isolated sandbox with **15 GB Free Storage**.\n- Upload files and photos\n- Create and organize folders\n- Ask Sana AI for coding doubts and viva prep\n- Use the Secret Vault for password-protected confidential files!\n`,
    'utf-8'
  );

  fs.writeFileSync(
    path.join(userRoot, 'Projects', 'app.js'),
    `// Sample JavaScript App\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to FileFlow AI.\`;\n}\n\nconsole.log(greet("User"));\n`,
    'utf-8'
  );

  fs.writeFileSync(
    path.join(userRoot, 'Documents', 'Project_Roadmap.txt'),
    `FileFlow AI Roadmap:\n1. 15 GB Free Cloud Storage [Active]\n2. Multi-user authentication & isolated sandboxing [Active]\n3. Sana AI Doubt Analyser & Viva Coach [Active]\n4. Password Protected Secret Vault [Active]\n5. FileFlow Pro 2 TB Upgrade ($59) [Active]\n`,
    'utf-8'
  );
}

// ==========================================
// 🔒 Private Secret Vault Handlers
// ==========================================

export async function browseVaultItems(userId: string, pin: string): Promise<FSItem[]> {
  const isValid = await verifyVaultPin(userId, pin);
  if (!isValid) {
    throw new Error('Invalid Secret Vault PIN / Password');
  }

  const vaultDir = getUserVaultDir(userId);
  const entries = fs.readdirSync(vaultDir, { withFileTypes: true });
  const items: FSItem[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const realPath = path.join(vaultDir, entry.name).replace(/\\/g, '/');
    try {
      const stat = fs.statSync(realPath);
      const isDir = stat.isDirectory();
      const ext = isDir ? '' : path.extname(entry.name).toLowerCase();
      const mimeType = isDir ? 'inode/directory' : (mime.lookup(entry.name) || 'application/octet-stream');

      items.push({
        id: `vault_${entry.name}`,
        name: entry.name,
        path: `/vault/${entry.name}`,
        relativePath: entry.name,
        isDirectory: isDir,
        size: stat.size,
        extension: ext,
        mimeType,
        createdAt: stat.birthtime.toISOString(),
        modifiedAt: stat.mtime.toISOString(),
        category: 'Personal Files',
      });
    } catch {}
  }

  return items;
}

export async function createVaultSecretFile(userId: string, pin: string, fileName: string, content: string): Promise<{ success: boolean }> {
  const isValid = await verifyVaultPin(userId, pin);
  if (!isValid) {
    throw new Error('Invalid Secret Vault PIN / Password');
  }

  const sanitized = fileName.trim().replace(/[\\/:*?"<>|]/g, '_');
  const vaultDir = getUserVaultDir(userId);
  const targetPath = path.join(vaultDir, sanitized).replace(/\\/g, '/');

  fs.writeFileSync(targetPath, content || '', 'utf-8');
  return { success: true };
}

export async function moveItemIntoVault(userId: string, virtualPath: string): Promise<{ success: boolean; fileName: string }> {
  const { realPath } = resolveUserPath(userId, virtualPath);
  if (!fs.existsSync(realPath)) {
    throw new Error(`File not found: ${virtualPath}`);
  }

  const baseName = path.basename(realPath);
  const vaultDir = getUserVaultDir(userId);
  const targetVaultPath = path.join(vaultDir, baseName).replace(/\\/g, '/');

  fs.renameSync(realPath, targetVaultPath);
  return { success: true, fileName: baseName };
}

export async function deleteVaultSecretItem(userId: string, pin: string, fileName: string): Promise<{ success: boolean }> {
  const isValid = await verifyVaultPin(userId, pin);
  if (!isValid) {
    throw new Error('Invalid Secret Vault PIN / Password');
  }

  const sanitized = fileName.trim().replace(/[\\/:*?"<>|]/g, '_');
  const vaultDir = getUserVaultDir(userId);
  const targetPath = path.join(vaultDir, sanitized).replace(/\\/g, '/');

  if (fs.existsSync(targetPath)) {
    fs.unlinkSync(targetPath);
  }
  return { success: true };
}
