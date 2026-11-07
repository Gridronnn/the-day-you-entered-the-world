import { FileRecord } from '../types';

export interface SearchQueryFilters {
  rawQuery?: string;
  category?: string;
  minSize?: number;
  maxSize?: number;
  modifiedAfter?: Date;
  modifiedBefore?: Date;
  tags?: string[];
  isDuplicate?: boolean;
  extension?: string;
}

export function parseNaturalLanguageQuery(query: string): SearchQueryFilters {
  const filters: SearchQueryFilters = { rawQuery: query };
  const lower = query.toLowerCase();

  // 1. Category extraction
  if (/study|notes|slides|syllabus|exam|lecture/i.test(lower)) {
    filters.category = 'Study Materials';
  } else if (/code|script|program|java|python|cpp|c\+\+|sql|javascript/i.test(lower)) {
    filters.category = 'Code';
  } else if (/image|photo|picture|screenshot/i.test(lower)) {
    filters.category = 'Images';
  } else if (/video|recording|lecture video/i.test(lower)) {
    filters.category = 'Videos';
  } else if (/document|doc|pdf|word|sheet/i.test(lower)) {
    filters.category = 'Documents';
  } else if (/resume|cv|marksheet|id/i.test(lower)) {
    filters.category = 'Personal Files';
  }

  // 2. Size threshold extraction
  const sizeMatch = lower.match(/(>|<|larger than|smaller than|above|below)\s*(\d+(\.\d+)?)\s*(mb|gb|kb)/i);
  if (sizeMatch) {
    const operator = sizeMatch[1];
    const val = parseFloat(sizeMatch[2]);
    const unit = sizeMatch[4].toLowerCase();
    const multiplier = unit === 'gb' ? 1024 * 1024 * 1024 : unit === 'mb' ? 1024 * 1024 : 1024;
    const bytes = val * multiplier;

    if (operator.includes('>') || operator.includes('larger') || operator.includes('above')) {
      filters.minSize = bytes;
    } else {
      filters.maxSize = bytes;
    }
  }

  // 3. Temporal filters
  const now = new Date();
  if (lower.includes('today')) {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filters.modifiedAfter = todayStart;
  } else if (lower.includes('this week') || lower.includes('last 7 days')) {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filters.modifiedAfter = weekAgo;
  } else if (lower.includes('this month')) {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    filters.modifiedAfter = monthStart;
  } else if (lower.includes('last semester') || lower.includes('old')) {
    const monthsAgo = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
    filters.modifiedBefore = monthsAgo;
  }

  // 4. Duplicate intent
  if (lower.includes('duplicate') || lower.includes('copies') || lower.includes('repeated')) {
    filters.isDuplicate = true;
  }

  return filters;
}

export function searchFiles(files: FileRecord[], queryFilters: SearchQueryFilters): { files: FileRecord[]; explanation: string } {
  const parts: string[] = [];

  const matched = files.filter((file) => {
    if (queryFilters.category && file.category.toLowerCase() !== queryFilters.category.toLowerCase()) {
      return false;
    }

    if (queryFilters.minSize !== undefined && file.size < queryFilters.minSize) {
      return false;
    }

    if (queryFilters.maxSize !== undefined && file.size > queryFilters.maxSize) {
      return false;
    }

    if (queryFilters.modifiedAfter && new Date(file.modifiedAt) < queryFilters.modifiedAfter) {
      return false;
    }

    if (queryFilters.modifiedBefore && new Date(file.modifiedAt) > queryFilters.modifiedBefore) {
      return false;
    }

    if (queryFilters.isDuplicate !== undefined && file.isDuplicate !== queryFilters.isDuplicate) {
      return false;
    }

    if (queryFilters.tags && queryFilters.tags.length > 0) {
      const hasTag = queryFilters.tags.some((t) => file.tags.includes(t.toLowerCase()));
      if (!hasTag) return false;
    }

    if (queryFilters.rawQuery && queryFilters.rawQuery.trim().length > 0) {
      const keywords = queryFilters.rawQuery
        .toLowerCase()
        .replace(/(>|<|larger than|smaller than|mb|gb|kb|duplicate|files|find|show|me|my)/gi, '')
        .split(/\s+/)
        .filter((k) => k.length > 2);

      if (keywords.length > 0) {
        const textToSearch = `${file.name} ${file.category} ${file.subcategory || ''} ${file.tags.join(' ')} ${file.classificationReason}`.toLowerCase();
        const matchesKeyword = keywords.some((k) => textToSearch.includes(k));
        if (!matchesKeyword) return false;
      }
    }

    return true;
  });

  if (queryFilters.category) parts.push(`Category: ${queryFilters.category}`);
  if (queryFilters.minSize) parts.push(`Size > ${(queryFilters.minSize / (1024 * 1024)).toFixed(1)} MB`);
  if (queryFilters.maxSize) parts.push(`Size < ${(queryFilters.maxSize / (1024 * 1024)).toFixed(1)} MB`);
  if (queryFilters.modifiedAfter) parts.push(`Modified after ${queryFilters.modifiedAfter.toLocaleDateString()}`);
  if (queryFilters.isDuplicate) parts.push('Identified duplicates only');

  const explanation = parts.length > 0 ? `Semantic Filter [${parts.join(', ')}] matched ${matched.length} files.` : `Keyword scan matched ${matched.length} files.`;

  return { files: matched, explanation };
}
