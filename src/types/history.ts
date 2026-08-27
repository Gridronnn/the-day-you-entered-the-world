export interface UserBirthInput {
  birthDate: string; // YYYY-MM-DD
  birthCity: string;
  birthCountry?: string;
  userName?: string;
}

export interface DayFacts {
  dayOfWeek: string;
  daysLived: number;
  heartbeats: number;
  breaths: number;
  julianDay: number;
  dayOfYear: number;
  leapYear: boolean;
}

export interface ZodiacInfo {
  western: {
    sign: string;
    symbol: string;
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    rulingPlanet: string;
    traits: string[];
    compatibility: string;
    luckyNumbers: number[];
  };
  chinese: {
    animal: string;
    element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
    polarity: 'Yin' | 'Yang';
    traits: string[];
    luckyNumbers: number[];
  };
  moonPhase: {
    name: string;
    ageDays: number;
    illuminationPct: number;
    phaseType: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
    poeticMeaning: string;
  };
  birthstone: {
    modern: string;
    traditional: string;
    color: string;
    meaning: string;
  };
  birthFlower: {
    name: string;
    symbolism: string;
  };
  season: string;
}

export interface WorldNewsItem {
  id: string;
  title: string;
  category: 'World' | 'Science' | 'Culture' | 'Politics' | 'Tech';
  description: string;
  source: string;
  impactTag: string;
}

export interface CityNewsItem {
  city: string;
  country: string;
  headline: string;
  snippet: string;
  localAtmosphere: string;
  landmark: string;
}

export interface HistoricalEvent {
  year: number;
  date: string;
  title: string;
  description: string;
  category: 'History' | 'Science' | 'Sports' | 'Discovery' | 'Arts';
  badge: string;
}

export interface FamousBirthday {
  name: string;
  role: string;
  year: number;
  quote?: string;
  knownFor: string;
  emoji: string;
}

export interface HistoricalWeather {
  tempC: number;
  tempF: number;
  condition: string;
  conditionCode: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'snow' | 'clear_night';
  humidity: number;
  windSpeedKmh: number;
  sunrise: string;
  sunset: string;
  dayLength: string;
  seasonNote: string;
  isReconstructed: boolean;
}

export interface CostItem {
  name: string;
  category: string;
  historicalValueUsd: number;
  currentValueUsd: number;
  unit: string;
  iconName: string;
  funFact?: string;
}

export interface CostOfLiving {
  goldOz: CostItem;
  petrolGallon: CostItem;
  bread: CostItem;
  milk: CostItem;
  movieTicket: CostItem;
  averageHome: CostItem;
  familyCar: CostItem;
  iconicTech: CostItem;
  inflationMultiplier: number;
}

export interface PopCulture {
  billboardSong: {
    title: string;
    artist: string;
    weeksAtNo1: number;
    genre: string;
    lyricsSnippet: string;
    melodyNotes?: { freq: number; duration: number }[];
  };
  boxOfficeMovie: {
    title: string;
    director: string;
    worldwideGross: string;
    genre: string;
    quote: string;
    tagline: string;
  };
  tvShows: string[];
  fashionTrends: string[];
  toysGames: string[];
  slang: { term: string; meaning: string }[];
}

export interface UpliftingEvent {
  title: string;
  category: 'Humanitarian' | 'Space' | 'Medical' | 'Environment' | 'Community';
  description: string;
  badge: string;
}

export interface ThenVsNowMetric {
  title: string;
  thenValue: string;
  nowValue: string;
  changeDescription: string;
  category: string;
  tag: string;
}

export interface DayDataPayload {
  input: UserBirthInput;
  dayFacts: DayFacts;
  zodiac: ZodiacInfo;
  worldNews: WorldNewsItem[];
  cityNews: CityNewsItem;
  historicalEvents: HistoricalEvent[];
  famousBirthdays: FamousBirthday[];
  weather: HistoricalWeather;
  costOfLiving: CostOfLiving;
  popCulture: PopCulture;
  upliftingEvents: UpliftingEvent[];
  thenVsNow: ThenVsNowMetric[];
  notableDeaths?: { name: string; role: string; year: number; legacy: string }[];
  sportsMilestone?: { title: string; champion: string; detail: string };
  classicBook?: { title: string; author: string; impact: string };
}

