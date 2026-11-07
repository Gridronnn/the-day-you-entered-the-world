import path from 'path';
import { FileRecord, RenameSuggestionItem } from '../types';

export function generateRenameSuggestions(files: FileRecord[]): RenameSuggestionItem[] {
  const suggestions: RenameSuggestionItem[] = [];

  for (const file of files) {
    const ext = file.extension;
    const nameWithoutExt = file.name.substring(0, file.name.length - ext.length);
    let suggestedName = file.name;
    let reason = 'Name is already well-formed.';

    // 1. Messy duplicate copy markers
    if (/\s*\(\d+\)|\s*-\s*Copy/i.test(nameWithoutExt)) {
      const cleaned = nameWithoutExt.replace(/\s*\(\d+\)|\s*-\s*Copy/gi, '').trim();
      suggestedName = `${cleaned}${ext}`;
      reason = 'Stripped redundant duplicate copy markers and OS artifacts.';
    }

    // 2. Chaotic notes names
    else if (/finalfinal|notes_final|temp_notes|doc1|untitled/i.test(nameWithoutExt)) {
      const subject = file.subcategory?.split(' ')[0] || file.category.replace(/\s+/g, '_');
      suggestedName = `${subject}_Comprehensive_Notes${ext}`;
      reason = `Standardized chaotic placeholder name using detected topic ${subject}.`;
    }

    // 3. Raw Camera / Screenshot filenames
    else if (/^IMG_\d+|^DSC_\d+|^Screenshot_\d+/i.test(nameWithoutExt)) {
      const year = new Date(file.modifiedAt).getFullYear();
      suggestedName = `College_Event_${year}_${nameWithoutExt}${ext}`;
      reason = 'Standardized raw camera code with event timestamp context.';
    }

    // 4. Inconsistent camelCase/snake_case to clean Title_Case
    else if (nameWithoutExt.includes('-') && !nameWithoutExt.includes('_')) {
      const cleaned = nameWithoutExt.replace(/-/g, '_');
      suggestedName = `${cleaned}${ext}`;
      reason = 'Standardized hyphen delimiter to uniform underscore naming.';
    }

    const dir = path.dirname(file.path);
    const suggestedFullPath = path.join(dir, suggestedName).replace(/\\/g, '/');

    suggestions.push({
      fileId: file.id,
      currentName: file.name,
      currentPath: file.path,
      suggestedName,
      suggestedFullPath,
      reason,
      selected: suggestedName !== file.name,
      hasConflict: false,
    });
  }

  return suggestions;
}
