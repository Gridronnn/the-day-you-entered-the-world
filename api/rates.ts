import { getReferenceExchangeRates } from './adapters/forexAdapter';

export default async function handler(req: any, res: any) {
  try {
    const rates = await getReferenceExchangeRates();
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=3600');
    return res.status(200).json(rates);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve reference rates', details: err.message });
  }
}
