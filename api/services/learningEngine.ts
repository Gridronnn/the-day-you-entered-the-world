import { getDb, saveDb } from '../db/database';
import { LearningRule, FileCategory } from '../types';

export async function getAllLearningRules(): Promise<LearningRule[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM learning_rules ORDER BY created_at DESC`);
  if (!res || res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row: any[]) => {
    const obj: any = {};
    cols.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return {
      id: obj.id,
      pattern: obj.pattern,
      targetCategory: obj.target_category as FileCategory,
      targetFolder: obj.target_folder,
      sourceReason: obj.source_reason,
      confidenceBoost: obj.confidence_boost,
      createdAt: obj.created_at,
      timesApplied: obj.times_applied,
    };
  });
}

export async function addLearningRule(rule: {
  pattern: string;
  targetCategory: string;
  targetFolder: string;
  sourceReason: string;
}): Promise<LearningRule> {
  const db = await getDb();
  const id = `rule-${Date.now()}`;
  const createdAt = new Date().toISOString();

  db.run(
    `INSERT INTO learning_rules (id, pattern, target_category, target_folder, source_reason, confidence_boost, created_at, times_applied)
     VALUES (?, ?, ?, ?, ?, 20.0, ?, 0)`,
    [id, rule.pattern, rule.targetCategory, rule.targetFolder, rule.sourceReason, createdAt]
  );

  saveDb();

  return {
    id,
    pattern: rule.pattern,
    targetCategory: rule.targetCategory as FileCategory,
    targetFolder: rule.targetFolder,
    sourceReason: rule.sourceReason,
    confidenceBoost: 20.0,
    createdAt,
    timesApplied: 0,
  };
}

export async function deleteLearningRule(id: string): Promise<boolean> {
  const db = await getDb();
  db.run(`DELETE FROM learning_rules WHERE id = ?`, [id]);
  saveDb();
  return true;
}
