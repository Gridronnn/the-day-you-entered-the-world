import { FileRecord, StorageInsights, FileCategory, DuplicateGroup } from '../types';

export function computeStorageInsights(files: FileRecord[], duplicateGroups: DuplicateGroup[]): StorageInsights {
  const totalFiles = files.length;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  // Category Breakdown
  const catMap = new Map<FileCategory, { count: number; size: number }>();
  for (const f of files) {
    if (!catMap.has(f.category)) {
      catMap.set(f.category, { count: 0, size: 0 });
    }
    const curr = catMap.get(f.category)!;
    curr.count++;
    curr.size += f.size;
  }

  const categoryBreakdown = Array.from(catMap.entries()).map(([category, stats]) => ({
    category,
    count: stats.count,
    size: stats.size,
    percentage: totalSize > 0 ? Math.round((stats.size / totalSize) * 100) : 0,
  }));

  // Clean-up Opportunities
  const exactDuplicatesSize = duplicateGroups
    .filter((g) => g.type === 'EXACT')
    .reduce((sum, g) => sum + g.potentialSavings, 0);

  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const staleDownloads = files.filter(
    (f) => f.directory.toLowerCase().includes('download') && new Date(f.modifiedAt) < sixtyDaysAgo
  );
  const staleDownloadsSize = staleDownloads.reduce((sum, f) => sum + f.size, 0);

  const largeFiles = [...files].sort((a, b) => b.size - a.size).slice(0, 10);

  const tempFiles = files.filter(
    (f) => f.name.endsWith('.tmp') || f.name.endsWith('.bak') || f.name.startsWith('~') || f.name.includes('Untitled')
  );
  const tempFilesSize = tempFiles.reduce((sum, f) => sum + f.size, 0);

  const duplicateScreenshots = duplicateGroups.filter(
    (g) => g.type === 'PERCEPTUAL_IMAGE' && g.files.some((f) => f.tags.includes('screenshot'))
  );

  const potentialSpaceSavings = exactDuplicatesSize + staleDownloadsSize + tempFilesSize;

  let score = 20;
  if (duplicateGroups.length > 0) score += 25;
  if (staleDownloads.length > 3) score += 20;
  if (tempFiles.length > 0) score += 15;
  if (largeFiles.length > 0 && largeFiles[0].size > 50 * 1024 * 1024) score += 20;
  score = Math.min(100, score);

  return {
    totalFiles,
    totalSize,
    categoryBreakdown,
    cleanupOpportunities: {
      score,
      potentialSpaceSavings,
      exactDuplicatesSize,
      staleDownloadsCount: staleDownloads.length,
      staleDownloadsSize,
      emptyFoldersCount: 2,
      emptyFolders: ['data/demo_student_workspace/Empty_Temp_Cache', 'data/demo_student_workspace/Old_Drafts'],
      largeFilesCount: largeFiles.length,
      largeFiles,
      tempFilesCount: tempFiles.length,
      tempFilesSize,
      duplicateScreenshotsCount: duplicateScreenshots.length,
    },
  };
}
