export type DataType =
  | 'historical_record'
  | 'calculated'
  | 'historical_estimate'
  | 'historical_reanalysis_estimate'
  | 'current_snapshot'
  | 'market_price_comparison'
  | 'unavailable';

export interface SourceCitation {
  name: string;
  url?: string;
  retrievedAt?: string;
  dataType?: DataType;
  attribution?: string;
  methodology?: string;
  confidence?: string;
  limitations?: string;
  stationOrGrid?: string;
}

export interface StoryQuery {
  date: string; // YYYY-MM-DD
  placeInput: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';
  chartRegion: 'US' | 'UK';
}

export interface LocationPayload {
  name: string;
  country: string;
  adminRegion?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevationMeters?: number;
  weatherStation?: string;
  source: SourceCitation;
}

export interface DateFactsPayload {
  dayOfWeek: string;
  julianDay: number;
  age: number;
  daysLived: number;
  heartbeatsEstimate: number;
  breathsEstimate: number;
  earthKmTraveledEstimate: number;
  westernZodiac: {
    sign: string;
    symbol: string;
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    rulingPlanet: string;
    traits: string[];
    compatibility: string;
    luckyNumbers: number[];
  };
  chineseZodiac: {
    animal: string;
    element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
    polarity: 'Yin' | 'Yang';
    traits: string[];
    luckyNumbers: number[];
  };
  birthstone: {
    name: string;
    traditional: string;
    meaning: string;
    color: string;
  };
  birthFlower: {
    name: string;
    meaning: string;
  };
  season: string;
  hemisphere: string;
  dayOfYear: number;
  isLeapYear: boolean;
  dataType: DataType;
  calculationBasis: string;
}

export interface WeatherPayload {
  status: 'available' | 'estimated' | 'unavailable';
  tempHighC: number;
  tempMeanC: number;
  tempLowC: number;
  tempHighF: number;
  tempMeanF: number;
  tempLowF: number;
  precipitationMm: number;
  humidityPct: number;
  windSpeedKmh: number;
  cloudCoverPct: number;
  weatherCode: number;
  condition: string;
  isSunnySupported: boolean;
  sunrise: string;
  sunset: string;
  daylightDuration: string;
  stationOrGrid: string;
  source: SourceCitation;
  disclaimer: string;
}

export interface AstronomyPayload {
  status: 'available' | 'unavailable';
  moonPhaseName: string;
  illuminationPct: number;
  moonAgeDays: number;
  phaseType: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  poeticMeaning: string;
  calculationBasis: {
    method: string;
    timezone: string;
    julianDayEphemeris: number;
    dataType: DataType;
    note: string;
  };
}

export interface NewsItemPayload {
  date: string;
  category: 'World' | 'Science' | 'Culture' | 'Politics' | 'Society';
  headline: string;
  summary: string;
  source_name: string;
  source_url?: string;
  published_at?: string;
  confidence: string;
  data_type: DataType;
}

export interface MusicPayload {
  status: 'available' | 'unavailable';
  chartRegion: string;
  chartDate: string;
  chartWeekLabel: string;
  rank: number;
  song: string;
  artist: string;
  weeksAtNo1: number;
  chartName: string;
  genre: string;
  lyricsSnippet: string;
  melodyNotes: Array<{ freq: number; duration: number }>;
  source_name: string;
  source_url: string;
  data_type: DataType;
}

export interface CinemaPayload {
  status: 'available' | 'unavailable';
  region: string;
  weekLabel: string;
  filmTitle: string;
  releaseYear: number;
  director: string;
  gross: string;
  rank: number;
  quote: string;
  tagline: string;
  genre: string;
  source_name: string;
  source_url: string;
  data_type: DataType;
}

export interface EconomicItemPayload {
  name: string;
  unit: string;
  historicalNominalUsd: number;
  currentMarketUsd: number;
  inflationAdjustedUsd: number;
  historicalValueSelectedCurrency: number;
  currentValueSelectedCurrency: number;
  data_type: DataType;
  source_name: string;
  source_url: string;
  asOfDate: string;
  methodology: string;
  iconName: string;
}

export interface EconomyPayload {
  status: 'available' | 'unavailable';
  inflationMultiplier: number;
  cpiIndexBaseYear: number;
  cpiIndexCurrent: number;
  asOfDate: string;
  dataSource: string;
  sourceUrl: string;
  items: EconomicItemPayload[];
}

export interface ComparisonMetricPayload {
  metric: string;
  historical_value: string;
  historical_date: string;
  current_value: string;
  current_date: string;
  unit: string;
  category: string;
  tag: string;
  changeDescription: string;
  source_name: string;
  source_url: string;
  methodology: string;
}

export interface TimelineItemPayload {
  year: number;
  age: number;
  title: string;
  category: 'Global Milestone' | 'Technology' | 'Space & Science' | 'Culture' | 'Humanity';
  description: string;
  source_name: string;
  source_url?: string;
  confidence: string;
}

export interface StoryResponse {
  query: StoryQuery;
  location: LocationPayload;
  dateFacts: DateFactsPayload;
  weather: WeatherPayload;
  astronomy: AstronomyPayload;
  news: NewsItemPayload[];
  music: MusicPayload;
  cinema: CinemaPayload;
  economy: EconomyPayload;
  comparisons: ComparisonMetricPayload[];
  timeline: TimelineItemPayload[];
  uplifting: Array<{
    title: string;
    category: string;
    description: string;
    badge: string;
    source_name: string;
    source_url?: string;
  }>;
  culturalTags: {
    tvShows: string[];
    fashionTrends: string[];
    popularToys: string[];
  };
  famousBirthdays: Array<{
    name: string;
    role: string;
    year: number;
    quote: string;
    knownFor: string;
    emoji: string;
  }>;
  metadata: {
    generatedAt: string;
    dataMode: 'historical_reconstruction';
    disclaimer: string;
    dataFreshness?: Record<string, string>;
    sources: Array<{ name: string; category: string; url: string }>;
    warnings: string[];
  };
}
