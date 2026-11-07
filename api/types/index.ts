export type FileCategory =
  | 'Documents'
  | 'Images'
  | 'Videos'
  | 'Audio'
  | 'Code'
  | 'Archives'
  | 'Installers'
  | 'Study Materials'
  | 'Personal Files'
  | 'Others';

export interface FileRecord {
  id: string;
  scanId: string;
  name: string;
  path: string;
  relativePath: string;
  directory: string;
  extension: string;
  mimeType: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  category: FileCategory;
  subcategory?: string;
  confidence: number;
  classificationReason: string;
  sha256: string;
  pHash?: string;
  tags: string[];
  isDuplicate: boolean;
  duplicateGroupId?: string;
  similarityScore?: number;
  suggestedAction?: 'MOVE' | 'RENAME' | 'RECYCLE' | 'KEEP';
  suggestedPath?: string;
  suggestedName?: string;
}

export interface ScanSession {
  id: string;
  rootPath: string;
  status: 'PENDING' | 'SCANNING' | 'COMPLETED' | 'FAILED';
  totalFiles: number;
  totalSize: number;
  duplicateCount: number;
  startTime: string;
  endTime?: string;
  isDemo: boolean;
}

export interface DuplicateGroup {
  id: string;
  type: 'EXACT' | 'PERCEPTUAL_IMAGE' | 'NEAR_DOC';
  hash: string;
  files: FileRecord[];
  recommendedKeepId: string;
  keepReason: string;
  potentialSavings: number;
  similarityPercentage: number;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  actionType: 'MOVE' | 'RENAME' | 'RECYCLE' | 'RESTORE' | 'DELETE';
  fileId: string;
  fileName: string;
  originalPath: string;
  newPath?: string;
  isReversible: boolean;
  undone: boolean;
  details: string;
}

export interface RecycleItem {
  id: string;
  originalPath: string;
  quarantinePath: string;
  fileName: string;
  size: number;
  deletedAt: string;
  sha256: string;
  category: FileCategory;
}

export interface LearningRule {
  id: string;
  pattern: string;
  targetCategory: FileCategory;
  targetFolder: string;
  sourceReason: string;
  confidenceBoost: number;
  createdAt: string;
  timesApplied: number;
}

export interface StorageInsights {
  totalFiles: number;
  totalSize: number;
  categoryBreakdown: { category: FileCategory; count: number; size: number; percentage: number }[];
  cleanupOpportunities: {
    score: number;
    potentialSpaceSavings: number;
    exactDuplicatesSize: number;
    staleDownloadsCount: number;
    staleDownloadsSize: number;
    emptyFoldersCount: number;
    emptyFolders: string[];
    largeFilesCount: number;
    largeFiles: FileRecord[];
    tempFilesCount: number;
    tempFilesSize: number;
    duplicateScreenshotsCount: number;
  };
}

export interface OrganizePlanItem {
  fileId: string;
  currentPath: string;
  fileName: string;
  category: FileCategory;
  suggestedRelativeFolder: string;
  suggestedFullPath: string;
  confidence: number;
  reason: string;
  selected: boolean;
  hasCollision: boolean;
}

export interface RenameSuggestionItem {
  fileId: string;
  currentName: string;
  currentPath: string;
  suggestedName: string;
  suggestedFullPath: string;
  reason: string;
  selected: boolean;
  hasConflict: boolean;
}
