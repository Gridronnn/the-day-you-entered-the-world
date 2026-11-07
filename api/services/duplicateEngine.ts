import { FileRecord, DuplicateGroup } from '../types';
import { computeHammingDistance, computeLevenshteinSimilarity, computeJaccardSimilarity } from './hasher';

export function identifyDuplicateGroups(files: FileRecord[]): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const processedIds = new Set<string>();

  // 1. Exact Duplicates by SHA-256
  const shaMap = new Map<string, FileRecord[]>();
  for (const file of files) {
    if (!shaMap.has(file.sha256)) {
      shaMap.set(file.sha256, []);
    }
    shaMap.get(file.sha256)!.push(file);
  }

  for (const [sha, groupFiles] of shaMap.entries()) {
    if (groupFiles.length > 1) {
      groupFiles.forEach((f) => processedIds.add(f.id));

      const sortedByOriginality = [...groupFiles].sort((a, b) => {
        const aHasCopy = /copy|\(\d+\)/i.test(a.name);
        const bHasCopy = /copy|\(\d+\)/i.test(b.name);
        if (aHasCopy && !bHasCopy) return 1;
        if (!aHasCopy && bHasCopy) return -1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      const recommendedKeep = sortedByOriginality[0];
      const singleFileSize = groupFiles[0].size;
      const potentialSavings = singleFileSize * (groupFiles.length - 1);

      groups.push({
        id: `dup-sha-${sha.substring(0, 12)}`,
        type: 'EXACT',
        hash: sha,
        files: groupFiles,
        recommendedKeepId: recommendedKeep.id,
        keepReason: `Canonical original: earliest creation date (${new Date(recommendedKeep.createdAt).toLocaleDateString()}) and clean filename without duplicate markers.`,
        potentialSavings,
        similarityPercentage: 100,
      });
    }
  }

  // 2. Perceptual Image Similarity
  const imageFiles = files.filter((f) => f.category === 'Images' && f.pHash && !processedIds.has(f.id));
  const visitedImageIds = new Set<string>();

  for (let i = 0; i < imageFiles.length; i++) {
    const f1 = imageFiles[i];
    if (visitedImageIds.has(f1.id)) continue;

    const cluster: FileRecord[] = [f1];
    for (let j = i + 1; j < imageFiles.length; j++) {
      const f2 = imageFiles[j];
      if (visitedImageIds.has(f2.id)) continue;

      const dist = computeHammingDistance(f1.pHash!, f2.pHash!);
      if (dist <= 6) {
        cluster.push(f2);
        visitedImageIds.add(f2.id);
      }
    }

    if (cluster.length > 1) {
      visitedImageIds.add(f1.id);
      cluster.forEach((f) => processedIds.add(f.id));

      const sortedByQuality = [...cluster].sort((a, b) => b.size - a.size);
      const recommendedKeep = sortedByQuality[0];
      const potentialSavings = cluster.reduce((sum, f) => sum + f.size, 0) - recommendedKeep.size;

      groups.push({
        id: `dup-phash-${f1.id}`,
        type: 'PERCEPTUAL_IMAGE',
        hash: f1.pHash!,
        files: cluster,
        recommendedKeepId: recommendedKeep.id,
        keepReason: `Highest resolution & quality copy retained (${(recommendedKeep.size / 1024).toFixed(1)} KB).`,
        potentialSavings,
        similarityPercentage: 92,
      });
    }
  }

  // 3. Near-Duplicate Document Names
  const docFiles = files.filter((f) => (f.category === 'Documents' || f.category === 'Study Materials') && !processedIds.has(f.id));
  const visitedDocIds = new Set<string>();

  for (let i = 0; i < docFiles.length; i++) {
    const d1 = docFiles[i];
    if (visitedDocIds.has(d1.id)) continue;

    const cluster: FileRecord[] = [d1];
    for (let j = i + 1; j < docFiles.length; j++) {
      const d2 = docFiles[j];
      if (visitedDocIds.has(d2.id)) continue;

      const jaccard = computeJaccardSimilarity(d1.name, d2.name);
      const lev = computeLevenshteinSimilarity(d1.name, d2.name);
      const combinedScore = (jaccard + lev) / 2;

      if (combinedScore >= 0.75 && Math.abs(d1.size - d2.size) < 1024 * 1024) {
        cluster.push(d2);
        visitedDocIds.add(d2.id);
      }
    }

    if (cluster.length > 1) {
      visitedDocIds.add(d1.id);
      cluster.forEach((f) => processedIds.add(f.id));

      const sortedByRecency = [...cluster].sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
      const recommendedKeep = sortedByRecency[0];
      const potentialSavings = cluster.reduce((sum, f) => sum + f.size, 0) - recommendedKeep.size;

      groups.push({
        id: `dup-doc-${d1.id}`,
        type: 'NEAR_DOC',
        hash: `sim-${d1.id}`,
        files: cluster,
        recommendedKeepId: recommendedKeep.id,
        keepReason: `Most recently updated version retained (${new Date(recommendedKeep.modifiedAt).toLocaleString()}).`,
        potentialSavings,
        similarityPercentage: 85,
      });
    }
  }

  return groups;
}
