import { getNormalizedEconomicFacts } from './adapters/economicsAdapter';
import { getReferenceExchangeRates } from './adapters/forexAdapter';

export default async function handler(req: any, res: any) {
  const year = parseInt(String(req.query.year || '1995'), 10);
  const currency = (String(req.query.currency || 'USD').toUpperCase() as any);
  const country = String(req.query.country || 'Global');

  if (isNaN(year) || year < 1930 || year > 2026) {
    return res.status(400).json({ error: 'Invalid year. Must be between 1930 and 2026.' });
  }

  try {
    const forex = await getReferenceExchangeRates();
    const economics = getNormalizedEconomicFacts(year, currency, country, forex);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=7200');
    return res.status(200).json(economics);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve economics facts', details: err.message });
  }
}
