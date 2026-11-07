import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getDb, saveDb } from '../db/database';

export interface User {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  bio?: string;
  avatarColor?: string;
  role?: string;
  institution?: string;
  department?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
  };
  isPro?: boolean;
  hasVaultPin?: boolean;
}

export const USERS_DATA_DIR = path.resolve(__dirname, '../../data/users');

// In-memory token store (token -> userId)
const activeTokens = new Map<string, { userId: string; expiresAt: number }>();

function hashPassword(password: string): string {
  const salt = 'fileflow_secure_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export function getUserRootDir(userId: string): string {
  const userRoot = path.join(USERS_DATA_DIR, userId, 'root').replace(/\\/g, '/');
  if (!fs.existsSync(userRoot)) {
    fs.mkdirSync(userRoot, { recursive: true });
  }
  return userRoot;
}

export function getUserQuarantineDir(userId: string): string {
  const quarantine = path.join(USERS_DATA_DIR, userId, 'quarantine').replace(/\\/g, '/');
  if (!fs.existsSync(quarantine)) {
    fs.mkdirSync(quarantine, { recursive: true });
  }
  return quarantine;
}

export function getUserVaultDir(userId: string): string {
  const vault = path.join(USERS_DATA_DIR, userId, 'secret_vault').replace(/\\/g, '/');
  if (!fs.existsSync(vault)) {
    fs.mkdirSync(vault, { recursive: true });
  }
  return vault;
}

function generateToken(userId: string): string {
  const token = `ff_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  activeTokens.set(token, { userId, expiresAt });
  return token;
}

function formatUserRow(row: any[]): User {
  let skills: string[] = ['JavaScript', 'Python', 'Problem Solving'];
  try {
    if (row[10]) skills = JSON.parse(row[10] as string);
  } catch {}

  let socialLinks: any = { github: '', linkedin: '', website: '' };
  try {
    if (row[11]) socialLinks = JSON.parse(row[11] as string);
  } catch {}

  const isPro = Number(row[12] || 0) === 1;
  const vaultPin = typeof row[13] === 'string' ? row[13] : '';
  const hasVaultPin = vaultPin.trim().length > 0;

  return {
    id: row[0] as string,
    username: row[1] as string,
    displayName: row[3] as string,
    createdAt: row[4] as string,
    bio: (row[5] as string) || '',
    avatarColor: (row[6] as string) || 'blue',
    role: (row[7] as string) || 'Computer Science Student',
    institution: (row[8] as string) || '',
    department: (row[9] as string) || '',
    skills,
    socialLinks,
    isPro,
    hasVaultPin,
  };
}

export async function registerUser(username: string, password: string, displayName?: string): Promise<{ user: User; token: string }> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  if (!password || password.length < 4) {
    throw new Error('Password must be at least 4 characters long');
  }

  const db = await getDb();
  const existing = db.exec(`SELECT id FROM users WHERE username = '${cleanUsername.replace(/'/g, "''")}'`);
  if (existing && existing.length > 0 && existing[0].values.length > 0) {
    throw new Error('Username is already taken');
  }

  const userId = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const passwordHash = hashPassword(password);
  const name = displayName?.trim() || cleanUsername;
  const createdAt = new Date().toISOString();

  const defaultSkills = JSON.stringify(['JavaScript', 'Python', 'Problem Solving', 'Data Structures']);
  const defaultSocial = JSON.stringify({ github: '', linkedin: '', website: '' });

  db.run(
    `INSERT INTO users (id, username, password_hash, display_name, created_at, bio, avatar_color, role, institution, department, skills, social_links, is_pro, vault_pin)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      cleanUsername,
      passwordHash,
      name,
      createdAt,
      'Passionate engineering student exploring full-stack systems and file intelligence.',
      'blue',
      'Computer Science Student',
      'Institute of Technology',
      'CSE / 2nd Year',
      defaultSkills,
      defaultSocial,
      0,
      '',
    ]
  );
  saveDb();

  getUserRootDir(userId);
  getUserQuarantineDir(userId);
  getUserVaultDir(userId);

  const token = generateToken(userId);
  const user: User = {
    id: userId,
    username: cleanUsername,
    displayName: name,
    createdAt,
    bio: 'Passionate engineering student exploring full-stack systems and file intelligence.',
    avatarColor: 'blue',
    role: 'Computer Science Student',
    institution: 'Institute of Technology',
    department: 'CSE / 2nd Year',
    skills: ['JavaScript', 'Python', 'Problem Solving', 'Data Structures'],
    socialLinks: { github: '', linkedin: '', website: '' },
    isPro: false,
    hasVaultPin: false,
  };
  return { user, token };
}

export async function loginUser(username: string, password: string): Promise<{ user: User; token: string }> {
  const cleanUsername = username.trim().toLowerCase();
  const passwordHash = hashPassword(password);

  const db = await getDb();
  const res = db.exec(`SELECT id, username, password_hash, display_name, created_at, bio, avatar_color, role, institution, department, skills, social_links, is_pro, vault_pin FROM users WHERE username = '${cleanUsername.replace(/'/g, "''")}'`);

  if (!res || res.length === 0 || res[0].values.length === 0) {
    throw new Error('Invalid username or password');
  }

  const row = res[0].values[0];
  const storedHash = row[2] as string;

  if (storedHash !== passwordHash) {
    throw new Error('Invalid username or password');
  }

  const user = formatUserRow(row);
  getUserRootDir(user.id);
  getUserQuarantineDir(user.id);
  getUserVaultDir(user.id);

  const token = generateToken(user.id);
  return { user, token };
}

export async function createGuestAccount(): Promise<{ user: User; token: string }> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const username = `guest_${randomSuffix}`;
  const password = `guest_${randomSuffix}`;
  const displayName = `Guest User #${randomSuffix}`;

  return registerUser(username, password, displayName);
}

export async function getUserFromToken(token: string): Promise<User | null> {
  if (!token) return null;
  const session = activeTokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    activeTokens.delete(token);
    return null;
  }

  const db = await getDb();
  const res = db.exec(`SELECT id, username, password_hash, display_name, created_at, bio, avatar_color, role, institution, department, skills, social_links, is_pro, vault_pin FROM users WHERE id = '${session.userId.replace(/'/g, "''")}'`);
  if (!res || res.length === 0 || res[0].values.length === 0) {
    return null;
  }

  return formatUserRow(res[0].values[0]);
}

export async function updateUserProfile(
  userId: string,
  data: {
    displayName?: string;
    bio?: string;
    avatarColor?: string;
    role?: string;
    institution?: string;
    department?: string;
    skills?: string[];
    socialLinks?: any;
  }
): Promise<User> {
  const db = await getDb();
  const res = db.exec(`SELECT id, username, password_hash, display_name, created_at, bio, avatar_color, role, institution, department, skills, social_links, is_pro, vault_pin FROM users WHERE id = '${userId.replace(/'/g, "''")}'`);

  if (!res || res.length === 0 || res[0].values.length === 0) {
    throw new Error('User not found');
  }

  const current = formatUserRow(res[0].values[0]);

  const updatedDisplayName = data.displayName?.trim() || current.displayName;
  const updatedBio = data.bio !== undefined ? data.bio : current.bio;
  const updatedAvatar = data.avatarColor || current.avatarColor;
  const updatedRole = data.role !== undefined ? data.role : current.role;
  const updatedInstitution = data.institution !== undefined ? data.institution : current.institution;
  const updatedDepartment = data.department !== undefined ? data.department : current.department;
  const updatedSkills = JSON.stringify(data.skills || current.skills || []);
  const updatedSocial = JSON.stringify(data.socialLinks || current.socialLinks || {});

  db.run(
    `UPDATE users SET
       display_name = ?,
       bio = ?,
       avatar_color = ?,
       role = ?,
       institution = ?,
       department = ?,
       skills = ?,
       social_links = ?
     WHERE id = ?`,
    [
      updatedDisplayName,
      updatedBio,
      updatedAvatar,
      updatedRole,
      updatedInstitution,
      updatedDepartment,
      updatedSkills,
      updatedSocial,
      userId,
    ]
  );
  saveDb();

  return {
    ...current,
    displayName: updatedDisplayName,
    bio: updatedBio,
    avatarColor: updatedAvatar,
    role: updatedRole,
    institution: updatedInstitution,
    department: updatedDepartment,
    skills: data.skills || current.skills,
    socialLinks: data.socialLinks || current.socialLinks,
  };
}

export async function updateUserPassword(userId: string, oldPass: string, newPass: string): Promise<{ success: boolean }> {
  if (!newPass || newPass.length < 4) {
    throw new Error('New password must be at least 4 characters');
  }

  const db = await getDb();
  const res = db.exec(`SELECT password_hash FROM users WHERE id = '${userId.replace(/'/g, "''")}'`);
  if (!res || res.length === 0 || res[0].values.length === 0) {
    throw new Error('User not found');
  }

  const storedHash = res[0].values[0][0] as string;
  if (storedHash !== hashPassword(oldPass)) {
    throw new Error('Current password is incorrect');
  }

  const newHash = hashPassword(newPass);
  db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHash, userId]);
  saveDb();

  return { success: true };
}

// 💎 Upgrade to FileFlow Pro ($59)
export async function upgradeUserToPro(userId: string): Promise<User> {
  const db = await getDb();
  db.run(`UPDATE users SET is_pro = 1 WHERE id = ?`, [userId]);
  saveDb();

  const res = db.exec(`SELECT id, username, password_hash, display_name, created_at, bio, avatar_color, role, institution, department, skills, social_links, is_pro, vault_pin FROM users WHERE id = '${userId.replace(/'/g, "''")}'`);
  if (!res || res.length === 0) throw new Error('User not found');
  return formatUserRow(res[0].values[0]);
}

// 🔒 Set / Change Private Vault PIN
export async function setVaultPin(userId: string, pin: string): Promise<{ success: boolean }> {
  const cleanPin = pin.trim();
  if (cleanPin.length < 4) {
    throw new Error('Vault PIN/Password must be at least 4 digits/characters');
  }
  const hashedPin = hashPassword(cleanPin);
  const db = await getDb();
  db.run(`UPDATE users SET vault_pin = ? WHERE id = ?`, [hashedPin, userId]);
  saveDb();
  return { success: true };
}

// 🔒 Verify Private Vault PIN
export async function verifyVaultPin(userId: string, pin: string): Promise<boolean> {
  const db = await getDb();
  const res = db.exec(`SELECT vault_pin FROM users WHERE id = '${userId.replace(/'/g, "''")}'`);
  if (!res || res.length === 0 || res[0].values.length === 0) return false;

  const storedPin = res[0].values[0][0] as string;
  if (!storedPin) return false;

  return storedPin === hashPassword(pin.trim());
}
