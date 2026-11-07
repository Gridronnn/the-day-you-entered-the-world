export type FactStatus =
  | 'live'
  | 'delayed'
  | 'historical'
  | 'modeled'
  | 'calculated'
  | 'estimated'
  | 'stale'
  | 'unavailable'
  | 'error';

export interface NormalizedFact<T = number | string> {
  value: T | null;
  unit: string;
  geography: string;
  metric: string;
  status: FactStatus;
  sourceName: string;
  sourceUrl: string;
  observedAt: string | null; // e.g. "1995-07-15" or "2026-11-06"
  publishedAt: string | null;
  fetchedAt: string; // ISO-8601
  methodology: string;
  coverageNote: string | null;
}

export interface EconomicFactBundle {
  gold: {
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
  };
  fuel: {
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
  };
  bread: {
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
  };
  milk: {
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
  };
  movieTicket: {
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
  };
  homeOrVehicle: {
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
  };
  iconicTech: {
    name: string;
    historical: NormalizedFact<number>;
    latest: NormalizedFact<number>;
    description: string;
  };
  inflation: {
    multiplier: number;
    baseYearCpi: number;
    latestCpi: number;
    cpiSeriesName: string;
    basePeriod: string;
    geography: string;
    calculationDate: string;
    status: FactStatus;
    sourceName: string;
    sourceUrl: string;
  };
  currencyConversionNote?: string;
}

export interface WeatherFactBundle {
  status: FactStatus;
  tempHighC: number | null;
  tempMeanC: number | null;
  tempLowC: number | null;
  tempHighF: number | null;
  tempMeanF: number | null;
  tempLowF: number | null;
  precipitationMm: number | null;
  humidityPct: number | null;
  windSpeedKmh: number | null;
  weatherCode: number | null;
  condition: string;
  sunrise: string | null;
  sunset: string | null;
  daylightDuration: string | null;
  geography: string;
  stationOrGrid: string;
  sourceName: string;
  sourceUrl: string;
  observedAt: string;
  publishedAt: string | null;
  fetchedAt: string;
  methodology: string;
  coverageNote: string | null;
}

export interface NewsFactItem {
  id: string;
  headline: string;
  summary: string;
  eventDate: string;
  category: string;
  status: FactStatus;
  sourceName: string;
  sourceUrl: string;
  observedAt: string;
  publishedAt: string | null;
  fetchedAt: string;
  methodology: string;
  coverageNote: string | null;
}
