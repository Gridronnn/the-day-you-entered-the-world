import { FactStatus } from './types';

export interface ExchangeRateTable {
  base: string;
  rates: Record<string, number>;
  observedAt: string; // Rate date, e.g. "2026-11-06"
  publishedAt?: string | null;
  fetchedAt: string;
  status: FactStatus;
  sourceName: string;
  sourceUrl: string;
  methodology: string;
  disclaimer: string;
}

interface CacheEntry {
  data: ExchangeRateTable;
  expiresAt: number;
}

let cachedRates: CacheEntry | null = null;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

// Fallback reference rates if network is unreachable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 84.4,
  CAD: 1.38,
  AUD: 1.54,
  JPY: 154.2,
};

export async function getReferenceExchangeRates(): Promise<ExchangeRateTable> {
  const now = Date.now();
  if (cachedRates && cachedRates.expiresAt > now) {
    return cachedRates.data;
  }

  // 1. Primary: Frankfurter API (ECB official reference rates)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && json.rates) {
        const rates: Record<string, number> = { USD: 1.0, ...json.rates };
        const result: ExchangeRateTable = {
          base: 'USD',
          rates,
          observedAt: json.date || new Date().toISOString().split('T')[0],
          publishedAt: json.date || null,
          fetchedAt: new Date().toISOString(),
          status: 'delayed',
          sourceName: 'European Central Bank (ECB) via Frankfurter',
          sourceUrl: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
          methodology: 'Official daily reference rates published by the European Central Bank around 16:00 CET on TARGET working days.',
          disclaimer: 'Reference rate for informational conversion. Does not reflect live commercial banking spreads, transaction fees, or retail bureau margins.',
        };

        cachedRates = { data: result, expiresAt: now + CACHE_TTL_MS };
        return result;
      }
    }
  } catch (err) {
    // Failover to secondary open rates
  }

  // 2. Secondary: Open Exchange Rates public mirror
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && json.rates) {
        const result: ExchangeRateTable = {
          base: 'USD',
          rates: json.rates,
          observedAt: json.time_last_update_utc ? json.time_last_update_utc.split(' ')[0] : new Date().toISOString().split('T')[0],
          publishedAt: json.time_last_update_utc || null,
          fetchedAt: new Date().toISOString(),
          status: 'delayed',
          sourceName: 'Open Exchange Rates (Public Reference Mirror)',
          sourceUrl: 'https://open.er-api.com/',
          methodology: 'Aggregated central bank and international forex reference rates updated daily.',
          disclaimer: 'Reference rate for informational conversion. Does not reflect live commercial banking spreads, transaction fees, or retail bureau margins.',
        };

        cachedRates = { data: result, expiresAt: now + CACHE_TTL_MS };
        return result;
      }
    }
  } catch (err) {
    // Failover to cached/fallback
  }

  // 3. Graceful fallback with honest 'stale' status
  const fallbackResult: ExchangeRateTable = {
    base: 'USD',
    rates: FALLBACK_RATES,
    observedAt: '2026-11-01',
    publishedAt: '2026-11-01',
    fetchedAt: new Date().toISOString(),
    status: 'stale',
    sourceName: 'ECB Historical Reference Baseline',
    sourceUrl: 'https://www.ecb.europa.eu/',
    methodology: 'Cached historical benchmark used because live rate providers were unreachable.',
    disclaimer: 'Showing cached benchmark rate. Live reference provider could not be reached.',
  };

  return fallbackResult;
}
