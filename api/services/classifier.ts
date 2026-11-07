import { FileCategory, LearningRule } from '../types';

interface ClassificationResult {
  category: FileCategory;
  subcategory?: string;
  confidence: number;
  reason: string;
  tags: string[];
}

export function classifyFile(
  fileName: string,
  extension: string,
  mimeType: string,
  learnedRules: LearningRule[] = []
): ClassificationResult {
  const ext = extension.toLowerCase().replace(/^\./, '');
  const lowerName = fileName.toLowerCase();
  const tags: string[] = [];

  // Tier 1: User-Learned Preferences
  for (const rule of learnedRules) {
    let matches = false;
    if (rule.pattern.startsWith('regex:')) {
      try {
        const regex = new RegExp(rule.pattern.replace('regex:', ''), 'i');
        matches = regex.test(fileName);
      } catch {
        matches = false;
      }
    } else if (rule.pattern.includes('*')) {
      const escaped = rule.pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
      matches = new RegExp(`^${escaped}$`, 'i').test(fileName);
    } else {
      matches = lowerName.includes(rule.pattern.toLowerCase());
    }

    if (matches) {
      return {
        category: rule.targetCategory,
        subcategory: 'Custom Preference Rule',
        confidence: Math.min(99, 85 + rule.confidenceBoost),
        reason: `Matched active learned rule: "${rule.pattern}" (${rule.sourceReason})`,
        tags: ['custom-rule', rule.targetCategory.toLowerCase()],
      };
    }
  }

  // Tier 2: Academic & Curriculum Pattern Engine
  if (/dbms|database|sql|normalization|acid|relational/i.test(lowerName)) {
    tags.push('academic', 'cse', 'dbms');
    return {
      category: 'Study Materials',
      subcategory: 'DBMS (Database Management)',
      confidence: 96,
      reason: 'Matched academic subject pattern for Database Management Systems (DBMS).',
      tags,
    };
  }

  if (/dsa|algorithm|data[_\-\s]?structure|tree|graph|linked[_\-\s]?list|stack|queue/i.test(lowerName)) {
    tags.push('academic', 'cse', 'dsa');
    return {
      category: 'Study Materials',
      subcategory: 'DSA (Data Structures & Algorithms)',
      confidence: 97,
      reason: 'Matched curriculum topic for Data Structures & Algorithms (DSA).',
      tags,
    };
  }

  if (/os|operating[_\-\s]?system|deadlock|process|thread|semaphore|paging/i.test(lowerName)) {
    tags.push('academic', 'cse', 'os');
    return {
      category: 'Study Materials',
      subcategory: 'OS (Operating Systems)',
      confidence: 95,
      reason: 'Matched academic syllabus keywords for Operating Systems.',
      tags,
    };
  }

  if (/cn|computer[_\-\s]?network|tcp|udp|osi|ip[_\-\s]?address|subnet/i.test(lowerName)) {
    tags.push('academic', 'cse', 'networking');
    return {
      category: 'Study Materials',
      subcategory: 'CN (Computer Networks)',
      confidence: 94,
      reason: 'Matched syllabus terms for Computer Networks.',
      tags,
    };
  }

  if (/assignment|lab|homework|syllabus|lecture|notes|module|unit[_\-\s]?\d+/i.test(lowerName)) {
    tags.push('academic', 'coursework');
    return {
      category: 'Study Materials',
      subcategory: 'Coursework & Notes',
      confidence: 91,
      reason: 'Matched student coursework keyword pattern.',
      tags,
    };
  }

  if (/resume|cv|biodata|cover[_\-\s]?letter|marksheet|certificate|id[_\-\s]?card|pan|aadhaar/i.test(lowerName)) {
    tags.push('personal', 'career');
    return {
      category: 'Personal Files',
      subcategory: 'Identity & Career',
      confidence: 95,
      reason: 'Matched personal career/identity document keywords.',
      tags,
    };
  }

  // Tier 3: MIME & Extension Deterministic Rules
  const codeExtensions = ['java', 'py', 'c', 'cpp', 'cs', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'sql', 'sh', 'json', 'yaml', 'yml'];
  if (codeExtensions.includes(ext) || mimeType.includes('javascript') || mimeType.includes('json')) {
    tags.push('code', ext);
    return {
      category: 'Code',
      subcategory: ext.toUpperCase(),
      confidence: 98,
      reason: `Deterministic source code format (.${ext}).`,
      tags,
    };
  }

  const docExtensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'md', 'csv', 'epub', 'rtf'];
  if (docExtensions.includes(ext) || mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('document')) {
    tags.push('document', ext);
    return {
      category: 'Documents',
      subcategory: ext.toUpperCase(),
      confidence: 92,
      reason: `Document format verified via extension (.${ext}) and MIME.`,
      tags,
    };
  }

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico', 'heic'];
  if (imageExtensions.includes(ext) || mimeType.startsWith('image/')) {
    tags.push('image', ext);
    const isScreenshot = /screenshot|screen[_\-\s]?shot|snip/i.test(lowerName);
    return {
      category: 'Images',
      subcategory: isScreenshot ? 'Screenshots' : 'Photos',
      confidence: 95,
      reason: `Image format (.${ext}) with image MIME detection.`,
      tags: isScreenshot ? [...tags, 'screenshot'] : tags,
    };
  }

  const videoExtensions = ['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv', 'webm', 'm4v'];
  if (videoExtensions.includes(ext) || mimeType.startsWith('video/')) {
    tags.push('video', ext);
    return {
      category: 'Videos',
      subcategory: 'Media Video',
      confidence: 96,
      reason: `Video binary container (.${ext}).`,
      tags,
    };
  }

  const audioExtensions = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a', 'wma'];
  if (audioExtensions.includes(ext) || mimeType.startsWith('audio/')) {
    tags.push('audio', ext);
    return {
      category: 'Audio',
      subcategory: 'Audio Media',
      confidence: 96,
      reason: `Audio audio stream file (.${ext}).`,
      tags,
    };
  }

  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'iso'];
  if (archiveExtensions.includes(ext) || mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compressed')) {
    tags.push('archive', ext);
    return {
      category: 'Archives',
      subcategory: 'Compressed Package',
      confidence: 97,
      reason: `Compressed archive archive format (.${ext}).`,
      tags,
    };
  }

  const installerExtensions = ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk'];
  if (installerExtensions.includes(ext)) {
    tags.push('installer', ext);
    return {
      category: 'Installers',
      subcategory: 'Software Installer',
      confidence: 98,
      reason: `Executable program installer (.${ext}).`,
      tags,
    };
  }

  // Tier 4: Fallback
  return {
    category: 'Others',
    subcategory: 'Unclassified',
    confidence: 60,
    reason: 'Generic fallback classifier - no distinctive keyword or extension matched.',
    tags: ['uncategorized'],
  };
}
