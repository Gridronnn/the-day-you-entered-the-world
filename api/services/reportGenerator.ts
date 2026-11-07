import { FileRecord, StorageInsights } from '../types';

export function generateCsvReport(files: FileRecord[]): string {
  const headers = ['File Name', 'Category', 'Subcategory', 'Confidence (%)', 'Size (Bytes)', 'Relative Path', 'SHA-256', 'Is Duplicate', 'AI Classification Rationale'];
  const rows = files.map((f) => [
    `"${f.name.replace(/"/g, '""')}"`,
    `"${f.category}"`,
    `"${f.subcategory || ''}"`,
    f.confidence,
    f.size,
    `"${f.relativePath.replace(/"/g, '""')}"`,
    `"${f.sha256}"`,
    f.isDuplicate ? 'YES' : 'NO',
    `"${f.classificationReason.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function generateHtmlReport(files: FileRecord[], insights: StorageInsights): string {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const rows = files
    .map(
      (f) => `
    <tr>
      <td><strong>${f.name}</strong></td>
      <td><span class="badge ${f.category.toLowerCase().replace(/\s+/g, '-')}">${f.category}</span></td>
      <td>${f.subcategory || '-'}</td>
      <td>${f.confidence}%</td>
      <td>${formatSize(f.size)}</td>
      <td><code>${f.relativePath}</code></td>
      <td>${f.isDuplicate ? '<span class="text-danger">Duplicate</span>' : '<span class="text-success">Unique</span>'}</td>
      <td><small>${f.classificationReason}</small></td>
    </tr>`
    )
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FileFlow AI – Storage & Classification Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 2rem; }
    .header { border-bottom: 2px solid #334155; padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .title { color: #818cf8; font-size: 1.5rem; font-weight: bold; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: #1e293b; border: 1px solid #334155; padding: 1.25rem; rounded: 12px; border-radius: 8px; }
    .card h3 { margin: 0; font-size: 0.8rem; text-transform: uppercase; color: #94a3b8; }
    .card p { margin: 0.5rem 0 0 0; font-size: 1.5rem; font-weight: bold; color: #38bdf8; }
    table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; font-size: 0.85rem; }
    th { background: #334155; text-align: left; padding: 0.75rem 1rem; color: #e2e8f0; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #334155; }
    tr:hover { background: #28364e; }
    code { font-family: monospace; color: #a5b4fc; }
    .badge { padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.75rem; background: #475569; }
    .text-danger { color: #f43f5e; font-weight: bold; }
    .text-success { color: #10b981; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">FileFlow AI – Workspace Audit Report</div>
      <small style="color: #94a3b8;">Generated on ${new Date().toLocaleString()} • 100% Local & Privacy-Safe</small>
    </div>
  </div>

  <div class="card-grid">
    <div class="card">
      <h3>Total Files Analyzed</h3>
      <p>${files.length}</p>
    </div>
    <div class="card">
      <h3>Total Storage Volume</h3>
      <p>${formatSize(files.reduce((sum, f) => sum + f.size, 0))}</p>
    </div>
    <div class="card">
      <h3>Cleanup Opportunity Score</h3>
      <p>${insights.cleanupOpportunities.score}/100</p>
    </div>
    <div class="card">
      <h3>Potential Reclaim</h3>
      <p style="color: #4ade80;">${formatSize(insights.cleanupOpportunities.potentialSpaceSavings)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>File Name</th>
        <th>Category</th>
        <th>Subcategory</th>
        <th>Confidence</th>
        <th>Size</th>
        <th>Relative Path</th>
        <th>Duplicate Status</th>
        <th>AI Rationale</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>
  `;
}
