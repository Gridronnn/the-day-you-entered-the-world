import path from 'path';
import { FileRecord, OrganizePlanItem } from '../types';

export function generateOrganizationPlan(files: FileRecord[], rootDir: string): OrganizePlanItem[] {
  const plan: OrganizePlanItem[] = [];

  for (const file of files) {
    let targetSubfolder = 'Others';

    switch (file.category) {
      case 'Study Materials':
        if (file.subcategory && file.subcategory.includes('DBMS')) {
          targetSubfolder = 'Study/DBMS';
        } else if (file.subcategory && file.subcategory.includes('DSA')) {
          targetSubfolder = 'Study/DSA';
        } else if (file.subcategory && file.subcategory.includes('OS')) {
          targetSubfolder = 'Study/OS';
        } else if (file.subcategory && file.subcategory.includes('CN')) {
          targetSubfolder = 'Study/CN';
        } else {
          targetSubfolder = 'Study/General_Notes';
        }
        break;

      case 'Code':
        targetSubfolder = `Projects/${file.subcategory || 'Source_Code'}`;
        break;

      case 'Documents':
        targetSubfolder = `Documents/${file.subcategory || 'General'}`;
        break;

      case 'Images':
        const year = new Date(file.modifiedAt).getFullYear();
        targetSubfolder = `Media/Photos/${year}`;
        break;

      case 'Videos':
        targetSubfolder = 'Media/Videos';
        break;

      case 'Audio':
        targetSubfolder = 'Media/Audio';
        break;

      case 'Archives':
        targetSubfolder = 'Archives';
        break;

      case 'Installers':
        targetSubfolder = 'Software/Installers';
        break;

      case 'Personal Files':
        targetSubfolder = 'Personal';
        break;

      default:
        targetSubfolder = 'Others';
    }

    const suggestedFullPath = path.join(rootDir, targetSubfolder, file.name).replace(/\\/g, '/');
    const isAlreadyThere = file.path.replace(/\\/g, '/') === suggestedFullPath;

    plan.push({
      fileId: file.id,
      currentPath: file.path,
      fileName: file.name,
      category: file.category,
      suggestedRelativeFolder: targetSubfolder,
      suggestedFullPath,
      confidence: file.confidence,
      reason: `Route to ${targetSubfolder} based on ${file.category} analysis (${file.classificationReason})`,
      selected: !isAlreadyThere,
      hasCollision: false,
    });
  }

  return plan;
}
