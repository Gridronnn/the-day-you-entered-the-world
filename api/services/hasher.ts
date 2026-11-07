import crypto from 'crypto';
import fs from 'fs';

export async function computeSHA256(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

export function computeQuickImageDHash(filePath: string): string {
  try {
    const stats = fs.statSync(filePath);
    const fd = fs.openSync(filePath, 'r');
    const sampleSize = Math.min(stats.size, 8192);
    const buffer = Buffer.alloc(sampleSize);
    fs.readSync(fd, buffer, 0, sampleSize, 0);
    fs.closeSync(fd);

    let hash = '';
    for (let i = 0; i < 64; i++) {
      const idx1 = (i * 37) % buffer.length;
      const idx2 = ((i + 1) * 37) % buffer.length;
      hash += buffer[idx1] > buffer[idx2] ? '1' : '0';
    }
    return hash;
  } catch {
    return '0'.repeat(64);
  }
}

export function computeHammingDistance(h1: string, h2: string): number {
  if (h1.length !== h2.length) return 64;
  let dist = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) dist++;
  }
  return dist;
}

export function computeJaccardSimilarity(strA: string, strB: string): number {
  const wordsA = new Set(strA.toLowerCase().split(/[\s_\-.]+/).filter(Boolean));
  const wordsB = new Set(strB.toLowerCase().split(/[\s_\-.]+/).filter(Boolean));
  if (wordsA.size === 0 && wordsB.size === 0) return 1.0;
  if (wordsA.size === 0 || wordsB.size === 0) return 0.0;

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return intersection.size / union.size;
}

export function computeLevenshteinSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return maxLen === 0 ? 1.0 : (maxLen - distance) / maxLen;
}
