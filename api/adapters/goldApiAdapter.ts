import { NormalizedFact } from './types';

export async function fetchLiveGoldSpot(
  currency: string
): Promise<NormalizedFact<number> | null> {
  const apiKey = process.env.GOLDAPI_KEY;

  if (!apiKey) {
    // Graceful no-credential disclosure
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://www.goldapi.io/api/XAU/${currency.toUpperCase()}`, {
      signal: controller.signal,
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.price === 'number') {
        const observedAt = data.timestamp
          ? new Date(data.timestamp * 1000).toISOString()
          : new Date().toISOString();

        return {
          value: Number(data.price.toFixed(2)),
          unit: `${currency} per Troy Ounce`,
          geography: 'Global Spot Market',
          metric: 'Fine Gold Spot Rate',
          status: 'live',
          sourceName: 'GoldAPI.io (Live Market Feed)',
          sourceUrl: 'https://www.goldapi.io/',
          observedAt,
          publishedAt: observedAt,
          fetchedAt: new Date().toISOString(),
          methodology: 'Real-time financial market spot aggregation via GoldAPI.',
          coverageNote: 'Live streaming spot price.',
        };
      }
    }
  } catch (err) {
    // Failover
  }

  return null;
}
