import { CostOfLiving, CostItem } from '../types/history';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateToUsd: number; // 1 USD = X Currency
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rateToUsd: 1.0, label: 'US Dollar ($)' },
  EUR: { code: 'EUR', symbol: '€', rateToUsd: 0.92, label: 'Euro (€)' },
  GBP: { code: 'GBP', symbol: '£', rateToUsd: 0.78, label: 'British Pound (£)' },
  INR: { code: 'INR', symbol: '₹', rateToUsd: 84.5, label: 'Indian Rupee (₹)' },
  CAD: { code: 'CAD', symbol: 'C$', rateToUsd: 1.38, label: 'Canadian Dollar (C$)' },
  AUD: { code: 'AUD', symbol: 'A$', rateToUsd: 1.54, label: 'Australian Dollar (A$)' },
  JPY: { code: 'JPY', symbol: '¥', rateToUsd: 154.0, label: 'Japanese Yen (¥)' },
};

// Historical CPI inflation factors relative to 2026 (~$1.00 in 2026)
const CPI_TABLE: Record<number, number> = {
  1930: 0.05, 1940: 0.06, 1950: 0.09, 1955: 0.10, 1960: 0.11,
  1965: 0.12, 1970: 0.15, 1975: 0.20, 1980: 0.32, 1985: 0.40,
  1990: 0.48, 1995: 0.56, 2000: 0.64, 2005: 0.73, 2010: 0.81,
  2015: 0.88, 2020: 0.95, 2024: 0.98, 2026: 1.00,
};

export function getInflationFactor(year: number): number {
  if (CPI_TABLE[year]) return CPI_TABLE[year];
  const years = Object.keys(CPI_TABLE).map(Number).sort((a, b) => a - b);
  for (let i = 0; i < years.length - 1; i++) {
    if (year >= years[i] && year <= years[i + 1]) {
      const t = (year - years[i]) / (years[i + 1] - years[i]);
      return CPI_TABLE[years[i]] + t * (CPI_TABLE[years[i + 1]] - CPI_TABLE[years[i]]);
    }
  }
  if (year < years[0]) return CPI_TABLE[years[0]];
  return 1.0;
}

export function formatPrice(usdAmount: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = usdAmount * config.rateToUsd;

  if (currency === 'JPY' || currency === 'INR') {
    if (converted >= 10000000) {
      return `${config.symbol}${(converted / 10000000).toFixed(2)} Cr`;
    }
    if (converted >= 100000) {
      return `${config.symbol}${(converted / 100000).toFixed(1)} L`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  if (converted >= 1000000) {
    return `${config.symbol}${(converted / 1000000).toFixed(2)}M`;
  }
  if (converted >= 1000) {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }
  if (converted < 1) {
    return `${config.symbol}${converted.toFixed(2)}`;
  }
  return `${config.symbol}${converted.toFixed(2)}`;
}

export function calculateCostOfLiving(year: number): CostOfLiving {
  const factor = getInflationFactor(year);

  // Gold price per oz historical formula
  let goldUsd = 35;
  if (year <= 1971) goldUsd = 35;
  else if (year <= 1980) goldUsd = 35 + ((year - 1971) / 9) * 580;
  else if (year <= 2000) goldUsd = 350 + Math.sin(year) * 60;
  else if (year <= 2011) goldUsd = 300 + ((year - 2000) / 11) * 1300;
  else if (year <= 2020) goldUsd = 1400 + ((year - 2011) / 9) * 450;
  else goldUsd = 1900 + ((year - 2020) / 6) * 650;
  goldUsd = Math.round(goldUsd);

  // Petrol/gas per gallon
  let petrolUsd = Math.max(0.18, Math.round((0.30 + factor * 3.2 + Math.sin(year) * 0.2) * 100) / 100);
  if (year < 1970) petrolUsd = 0.31;
  else if (year < 1980) petrolUsd = 0.55;

  // Bread
  const breadUsd = Math.max(0.10, Math.round((0.15 + factor * 2.8) * 100) / 100);

  // Milk
  const milkUsd = Math.max(0.20, Math.round((0.40 + factor * 3.7) * 100) / 100);

  // Movie ticket
  const movieTicketUsd = Math.max(0.50, Math.round((0.60 + factor * 11.5) * 100) / 100);

  // Average home
  const homeUsd = Math.round(7500 + factor * 415000);

  // Family car
  const carUsd = Math.round(1800 + factor * 42000);

  // Iconic tech
  let techName = 'Vintage Turntable Stereo';
  let techPrice = 80;
  let techFact = 'Analog vinyl warmth ruled the airwaves.';

  if (year >= 2015) {
    techName = 'Apple Watch / 4K OLED TV';
    techPrice = 399;
    techFact = 'Smart wearable fitness & ultra-HD streaming revolution.';
  } else if (year >= 2007) {
    techName = 'Original Apple iPhone / Smartphone';
    techPrice = 499;
    techFact = 'Steve Jobs unveiled multi-touch screen that changed mobile forever.';
  } else if (year >= 2001) {
    techName = 'Apple iPod (1,000 Songs in your Pocket)';
    techPrice = 399;
    techFact = 'The iconic scroll wheel and FireWire digital jukebox.';
  } else if (year >= 1996) {
    techName = 'Nintendo 64 & PlayStation 1';
    techPrice = 199;
    techFact = 'Groundbreaking 3D polygon gaming revolution with Super Mario 64.';
  } else if (year >= 1989) {
    techName = 'Nintendo Game Boy (Tetris bundle)';
    techPrice = 89;
    techFact = 'Portable 8-bit gaming sensation with iconic green dot-matrix screen.';
  } else if (year >= 1984) {
    techName = 'Apple Macintosh 128K Computer';
    techPrice = 2495;
    techFact = 'The first mass-market personal computer with a mouse and GUI.';
  } else if (year >= 1979) {
    techName = 'Sony TPS-L2 Walkman Portable Cassette';
    techPrice = 150;
    techFact = 'First personal cassette stereo that let people walk with private music.';
  } else if (year >= 1977) {
    techName = 'Atari 2600 Video Computer System';
    techPrice = 199;
    techFact = 'Brought arcade classics like Pong and Space Invaders to the living room.';
  } else if (year >= 1965) {
    techName = 'Color CRT Television Set';
    techPrice = 450;
    techFact = 'Transformed black-and-white living rooms into vibrant living color.';
  }

  const inflationMultiplier = Math.round((1.0 / factor) * 10) / 10;

  return {
    goldOz: {
      name: 'Gold (1 Troy Ounce)',
      category: 'Precious Metals',
      historicalValueUsd: goldUsd,
      currentValueUsd: 2550,
      unit: 'per oz',
      iconName: 'Sparkles',
      funFact: 'Gold was pegged at $35/oz until the Bretton Woods system ended in 1971.',
    },
    petrolGallon: {
      name: 'Gasoline / Petrol',
      category: 'Energy',
      historicalValueUsd: petrolUsd,
      currentValueUsd: 3.65,
      unit: 'per gallon',
      iconName: 'Fuel',
      funFact: 'Gasoline was often served by full-service station attendants in vintage uniforms.',
    },
    bread: {
      name: 'Fresh Loaf of Bread',
      category: 'Staples',
      historicalValueUsd: breadUsd,
      currentValueUsd: 3.45,
      unit: 'per loaf',
      iconName: 'Wheat',
      funFact: 'Freshly sliced white bread was the universal symbol of suburban household comfort.',
    },
    milk: {
      name: 'Fresh Gallon of Milk',
      category: 'Dairy',
      historicalValueUsd: milkUsd,
      currentValueUsd: 4.15,
      unit: 'per gallon',
      iconName: 'Coffee',
      funFact: 'Often delivered directly to family doorsteps in clinking glass bottles by milkmen.',
    },
    movieTicket: {
      name: 'Cinema Movie Ticket',
      category: 'Entertainment',
      historicalValueUsd: movieTicketUsd,
      currentValueUsd: 14.50,
      unit: 'per ticket',
      iconName: 'Film',
      funFact: 'Included grand theater double features, newsreels, and buttery popcorn cartoons.',
    },
    averageHome: {
      name: 'Average Family Home',
      category: 'Real Estate',
      historicalValueUsd: homeUsd,
      currentValueUsd: 425000,
      unit: 'median price',
      iconName: 'Home',
      funFact: 'Suburban single-family homes were accessible on a single household income.',
    },
    familyCar: {
      name: 'Brand New Family Sedan',
      category: 'Automotive',
      historicalValueUsd: carUsd,
      currentValueUsd: 45000,
      unit: 'new car',
      iconName: 'Car',
      funFact: 'Featured chrome bumpers, bench seats, manual roll-down windows, and AM radios.',
    },
    iconicTech: {
      name: techName,
      category: 'Technology Milestone',
      historicalValueUsd: techPrice,
      currentValueUsd: Math.round(techPrice * (1.0 / factor)),
      unit: 'unit price',
      iconName: 'Cpu',
      funFact: techFact,
    },
    inflationMultiplier,
  };
}
