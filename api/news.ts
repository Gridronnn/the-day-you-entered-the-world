import { fetchNormalizedHistoricalNews } from './adapters/newsAdapter';

export default async function handler(req: any, res: any) {
  const date = String(req.query.date || '').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
  }

  try {
    const news = await fetchNormalizedHistoricalNews(date);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=7200');
    return res.status(200).json(news);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve historical news', details: err.message });
  }
}
