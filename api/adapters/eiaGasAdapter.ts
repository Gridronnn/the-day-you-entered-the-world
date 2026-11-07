import { NormalizedFact } from './types';

export async function fetchLiveEiaGasoline(): Promise<NormalizedFact<number> | null> {
  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const url = `https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=${apiKey}&frequency=weekly&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&length=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && json.response && json.response.data && json.response.data.length > 0) {
        const item = json.response.data[0];
        const val = parseFloat(item.value);
        if (!isNaN(val)) {
          return {
            value: Number(val.toFixed(2)),
            unit: 'USD per U.S. Gallon',
            geography: 'United States (National Average)',
            metric: 'Weekly Regular Retail Gasoline',
            status: 'delayed',
            sourceName: 'U.S. Energy Information Administration (EIA API v2)',
            sourceUrl: 'https://www.eia.gov/petroleum/gasdiesel/',
            observedAt: item.period || '2026-11-03',
            publishedAt: item.period || null,
            fetchedAt: new Date().toISOString(),
            methodology: 'Weekly retail gasoline price survey published Mondays by the U.S. EIA.',
            coverageNote: 'Official surveyed retail price.',
          };
        }
      }
    }
  } catch (err) {
    // Failover
  }

  return null;
}
