import { fetchNormalizedHistoricalWeather } from './adapters/weatherAdapter';

export default async function handler(req: any, res: any) {
  const date = String(req.query.date || '').trim();
  const lat = parseFloat(String(req.query.lat || '51.5074'));
  const lon = parseFloat(String(req.query.lon || '-0.1278'));
  const city = String(req.query.city || 'London').trim();
  const country = String(req.query.country || 'UK').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD.' });
  }

  try {
    const weather = await fetchNormalizedHistoricalWeather(date, lat, lon, city, country);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=7200');
    return res.status(200).json(weather);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve historical weather', details: err.message });
  }
}
