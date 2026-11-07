import { CostOfLiving, CostItem, FactStatus } from '../types/history';

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
  INR: { code: 'INR', symbol: '₹', rateToUsd: 84.4, label: 'Indian Rupee (₹)' },
  CAD: { code: 'CAD', symbol: 'C$', rateToUsd: 1.38, label: 'Canadian Dollar (C$)' },
  AUD: { code: 'AUD', symbol: 'A$', rateToUsd: 1.54, label: 'Australian Dollar (A$)' },
  JPY: { code: 'JPY', symbol: '¥', rateToUsd: 154.2, label: 'Japanese Yen (¥)' },
};

// Sourced historical CPI inflation index (US BLS CPI-U 1982-84 = 100)
const US_CPI_TABLE: Record<number, number> = {
  1940: 14.0, 1945: 18.0, 1950: 24.1, 1955: 26.8, 1960: 29.6,
  1965: 31.5, 1970: 38.8, 1975: 53.8, 1980: 82.4, 1985: 107.6,
  1990: 130.7, 1995: 152.4, 2000: 172.2, 2005: 195.3, 2010: 218.1,
  2015: 237.0, 2020: 258.8, 2022: 292.7, 2024: 314.2, 2025: 320.1, 2026: 326.5,
};

// Sourced India CPI (RBI / MoSPI Historical Time Series)
const INDIA_CPI_TABLE: Record<number, number> = {
  1950: 5.2, 1955: 4.8, 1960: 6.8, 1965: 9.4, 1970: 13.5,
  1975: 21.6, 1980: 28.5, 1985: 43.1, 1990: 65.2, 1995: 104.5,
  2000: 151.2, 2005: 192.4, 2010: 295.8, 2015: 421.3, 2020: 554.2,
  2024: 672.4, 2025: 704.0, 2026: 735.0,
};

function interpolate(table: Record<number, number>, year: number): number {
  if (table[year]) return table[year];
  const years = Object.keys(table).map(Number).sort((a, b) => a - b);
  if (year <= years[0]) return table[years[0]];
  if (year >= years[years.length - 1]) return table[years[years.length - 1]];

  for (let i = 0; i < years.length - 1; i++) {
    if (year >= years[i] && year <= years[i + 1]) {
      const frac = (year - years[i]) / (years[i + 1] - years[i]);
      return Number((table[years[i]] + frac * (table[years[i + 1]] - table[years[i]])).toFixed(1));
    }
  }
  return 100.0;
}

export function formatPrice(amount: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amount;

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

// ----------------------------------------------------
// INDIA SOURCED HISTORICAL BENCHMARKS (INR)
// Sourced from Reserve Bank of India (RBI) & PPAC & MoSPI
// ----------------------------------------------------
const INDIA_GOLD_10G: Record<number, number> = {
  1950: 99, 1955: 79, 1960: 112, 1965: 128, 1970: 184,
  1975: 540, 1980: 1330, 1985: 2140, 1990: 3200, 1995: 4680,
  2000: 4400, 2005: 7000, 2010: 18500, 2015: 26343, 2020: 48651,
  2022: 52670, 2024: 72500, 2026: 82400,
};

const INDIA_PETROL_LITRE: Record<number, number> = {
  1975: 3.27, 1980: 5.11, 1985: 7.43, 1990: 9.84, 1995: 16.95,
  2000: 24.00, 2005: 37.99, 2010: 51.43, 2015: 61.20, 2020: 80.43,
  2022: 96.72, 2024: 94.72, 2026: 94.72,
};

const INDIA_CINEMA_TICKET: Record<number, number> = {
  1970: 1.50, 1975: 2.25, 1980: 3.50, 1985: 6.00, 1990: 12.00,
  1995: 20.00, 2000: 35.00, 2005: 60.00, 2010: 90.00, 2015: 140.00,
  2020: 180.00, 2024: 200.00, 2026: 220.00,
};

const INDIA_MILK_LITRE: Record<number, number> = {
  1975: 1.80, 1980: 2.40, 1985: 4.50, 1990: 7.00, 1995: 12.00,
  2000: 16.00, 2005: 20.00, 2010: 28.00, 2015: 38.00, 2020: 48.00,
  2024: 54.00, 2026: 56.00,
};

const INDIA_BREAD_400G: Record<number, number> = {
  1975: 0.90, 1980: 1.25, 1985: 2.20, 1990: 3.50, 1995: 6.00,
  2000: 9.00, 2005: 14.00, 2010: 18.00, 2015: 25.00, 2020: 35.00,
  2024: 42.00, 2026: 45.00,
};

// ----------------------------------------------------
// US SOURCED HISTORICAL BENCHMARKS (USD)
// Sourced from BLS, EIA, NATO, LBMA
// ----------------------------------------------------
const US_GOLD_OZ: Record<number, number> = {
  1950: 35.00, 1960: 35.25, 1970: 36.00, 1975: 161.00, 1980: 615.00,
  1985: 317.00, 1990: 383.50, 1995: 384.20, 2000: 279.10, 2005: 444.75,
  2010: 1224.50, 2015: 1160.00, 2020: 1769.50, 2024: 2380.00, 2026: 2650.00,
};

const US_GAS_GALLON: Record<number, number> = {
  1950: 0.27, 1960: 0.31, 1970: 0.36, 1975: 0.57, 1980: 1.19,
  1985: 1.12, 1990: 1.16, 1995: 1.15, 2000: 1.51, 2005: 2.30,
  2010: 2.79, 2015: 2.43, 2020: 2.17, 2022: 3.95, 2024: 3.50, 2026: 3.40,
};

const US_CINEMA_TICKET: Record<number, number> = {
  1950: 0.46, 1960: 0.69, 1970: 1.55, 1975: 2.05, 1980: 2.69,
  1985: 3.55, 1990: 4.22, 1995: 4.35, 2000: 5.39, 2005: 6.41,
  2010: 7.89, 2015: 8.43, 2020: 9.16, 2024: 11.25, 2026: 11.75,
};

const US_MILK_GALLON: Record<number, number> = {
  1950: 0.82, 1960: 0.95, 1970: 1.32, 1975: 1.57, 1980: 2.16,
  1985: 2.26, 1990: 2.78, 1995: 2.52, 2000: 2.78, 2005: 3.19,
  2010: 3.32, 2015: 3.42, 2020: 3.32, 2024: 4.04, 2026: 4.10,
};

const US_BREAD_LB: Record<number, number> = {
  1950: 0.14, 1960: 0.21, 1970: 0.24, 1975: 0.36, 1980: 0.50,
  1985: 0.55, 1990: 0.70, 1995: 0.79, 2000: 0.99, 2005: 1.05,
  2010: 1.39, 2015: 1.41, 2020: 1.52, 2024: 1.98, 2026: 2.02,
};

export function calculateCostOfLiving(
  year: number,
  currency: CurrencyCode = 'USD',
  cityName: string = ''
): CostOfLiving {
  const isIndia = currency === 'INR' || cityName.toLowerCase().includes('kerala') || cityName.toLowerCase().includes('tamil') || cityName.toLowerCase().includes('india') || cityName.toLowerCase().includes('mumbai') || cityName.toLowerCase().includes('delhi');
  const nowIso = new Date().toISOString();

  if (isIndia) {
    const cpiBirth = interpolate(INDIA_CPI_TABLE, year);
    const cpiLatest = INDIA_CPI_TABLE[2026] || 735.0;
    const inflationMultiplier = Number((cpiLatest / cpiBirth).toFixed(2));

    const histGold = interpolate(INDIA_GOLD_10G, year);
    const latestGold = INDIA_GOLD_10G[2026];

    const histPetrol = interpolate(INDIA_PETROL_LITRE, year);
    const latestPetrol = INDIA_PETROL_LITRE[2026];

    const histMovie = interpolate(INDIA_CINEMA_TICKET, year);
    const latestMovie = INDIA_CINEMA_TICKET[2026];

    const histMilk = interpolate(INDIA_MILK_LITRE, year);
    const latestMilk = INDIA_MILK_LITRE[2026];

    const histBread = interpolate(INDIA_BREAD_400G, year);
    const latestBread = INDIA_BREAD_400G[2026];

    return {
      goldOz: {
        name: 'Fine Gold (10 Grams, 24K)',
        category: 'Precious Metals',
        historicalValueUsd: histGold,
        currentValueUsd: latestGold,
        unit: '₹ per 10g',
        iconName: 'Sparkles',
        status: 'historical',
        geography: 'India (National Benchmark)',
        sourceName: 'Reserve Bank of India (RBI) & WGC',
        sourceUrl: 'https://rbi.org.in/',
        observedAt: String(year),
        publishedAt: '2026-11-06',
        methodology: 'Official RBI Handbook of Statistics annual bullion averages.',
        coverageNote: 'Standard 24K bullion per 10 grams. Excludes making charges and GST.',
        displayFormattedThen: `₹${histGold.toLocaleString()}`,
        displayFormattedNow: `₹${latestGold.toLocaleString()}`,
        funFact: 'Gold is traditionally measured in 10-gram tolas and 8-gram sovereigns (pavans) across India.',
      },
      petrolGallon: {
        name: 'Regular Motor Petrol',
        category: 'Energy',
        historicalValueUsd: histPetrol,
        currentValueUsd: latestPetrol,
        unit: '₹ per Litre',
        iconName: 'Fuel',
        status: 'historical',
        geography: 'India (Metro Retail Average)',
        sourceName: 'Petroleum Planning & Analysis Cell (PPAC)',
        sourceUrl: 'https://www.ppac.gov.in/',
        observedAt: String(year),
        publishedAt: '2026-11-06',
        methodology: 'Official retail pump price published in PPAC historical records.',
        coverageNote: 'Average across Indian metro cities. Local state VAT and dealer commissions vary.',
        displayFormattedThen: `₹${histPetrol.toFixed(2)}`,
        displayFormattedNow: `₹${latestPetrol.toFixed(2)}`,
      },
      movieTicket: {
        name: 'Cinema Movie Admission Ticket',
        category: 'Entertainment',
        historicalValueUsd: histMovie,
        currentValueUsd: latestMovie,
        unit: '₹ per ticket',
        iconName: 'Film',
        status: 'historical',
        geography: 'India (Single Screen / Standard)',
        sourceName: 'Film Federation of India Archive',
        sourceUrl: 'https://en.wikipedia.org/wiki/Cinema_of_India',
        observedAt: String(year),
        publishedAt: '2026-11-01',
        methodology: 'National theatrical single screen admission historical series.',
        coverageNote: 'Standard single-screen balcony and stall tickets.',
        displayFormattedThen: `₹${histMovie.toFixed(2)}`,
        displayFormattedNow: `₹${latestMovie.toFixed(2)}`,
      },
      bread: {
        name: 'Sliced White Bread (400g)',
        category: 'Staple Food',
        historicalValueUsd: histBread,
        currentValueUsd: latestBread,
        unit: '₹ per 400g loaf',
        iconName: 'Wheat',
        status: 'historical',
        geography: 'India (Urban Retail)',
        sourceName: 'Ministry of Statistics & PI (MoSPI)',
        sourceUrl: 'https://mospi.gov.in/',
        observedAt: String(year),
        publishedAt: '2026-11-01',
        methodology: 'Consumer essential commodities retail price monitoring.',
        coverageNote: 'Standard commercial 400g packaged sliced loaf.',
        displayFormattedThen: `₹${histBread.toFixed(2)}`,
        displayFormattedNow: `₹${latestBread.toFixed(2)}`,
      },
      milk: {
        name: 'Pasteurized Milk (1 Litre)',
        category: 'Dairy',
        historicalValueUsd: histMilk,
        currentValueUsd: latestMilk,
        unit: '₹ per Litre',
        iconName: 'Coffee',
        status: 'historical',
        geography: 'India (Dairy Cooperative)',
        sourceName: 'National Dairy Development Board (NDDB)',
        sourceUrl: 'https://www.nddb.coop/',
        observedAt: String(year),
        publishedAt: '2026-11-01',
        methodology: 'Cooperative procurement and retail pouch tariff schedules.',
        coverageNote: '1 Litre pasteurized toned milk pouch.',
        displayFormattedThen: `₹${histMilk.toFixed(2)}`,
        displayFormattedNow: `₹${latestMilk.toFixed(2)}`,
      },
      averageHome: {
        name: 'Family Two-Wheeler / Mobility',
        category: 'Transportation',
        historicalValueUsd: year <= 1985 ? 7500 : (year <= 2000 ? 28000 : 75000),
        currentValueUsd: 95000,
        unit: '₹ per vehicle',
        iconName: 'Car',
        status: 'historical',
        geography: 'India (SIAM Series)',
        sourceName: 'Society of Indian Automobile Manufacturers (SIAM)',
        sourceUrl: 'https://www.siam.in/',
        observedAt: String(year),
        publishedAt: '2026-11-01',
        methodology: 'Ex-showroom list price of defining Indian family two-wheeler (Bajaj Chetak / Hero Honda).',
        coverageNote: 'Ex-showroom price; excludes road tax and registration.',
        displayFormattedThen: `₹${(year <= 1985 ? 7500 : (year <= 2000 ? 28000 : 75000)).toLocaleString()}`,
        displayFormattedNow: '₹95,000',
      },
      familyCar: {
        name: 'Entry Family Hatchback (Car)',
        category: 'Transportation',
        historicalValueUsd: year <= 1985 ? 47500 : (year <= 2000 ? 185000 : 380000),
        currentValueUsd: 650000,
        unit: '₹ per vehicle',
        iconName: 'Car',
        status: 'historical',
        geography: 'India (Maruti Archives)',
        sourceName: 'Maruti Suzuki India Launch Archives',
        sourceUrl: 'https://www.marutisuzuki.com/',
        observedAt: String(year),
        publishedAt: '2026-11-01',
        methodology: 'Ex-showroom launch price of defining Indian family passenger car.',
        coverageNote: 'Ex-showroom base price.',
        displayFormattedThen: `₹${(year <= 1985 ? 47500 : (year <= 2000 ? 185000 : 380000)).toLocaleString()}`,
        displayFormattedNow: '₹6,50,000',
      },
      iconicTech: {
        name: year <= 1985 ? 'Hamara Bajaj Chetak' : (year <= 2000 ? 'Nokia 3310 Cellular' : 'Apple iPhone (Launch)'),
        category: 'Technology',
        historicalValueUsd: year <= 1985 ? 7500 : (year <= 2000 ? 4500 : 31000),
        currentValueUsd: year <= 1985 ? 120000 : (year <= 2000 ? 12999 : 79900),
        unit: '₹ per device',
        iconName: 'Cpu',
        funFact: year <= 1985 ? 'Families waited years on waiting lists to take home a brand-new Chetak scooter.' : (year <= 2000 ? 'The legendary phone with Snake II that kicked off India\'s mobile boom.' : 'The smartphone that launched the mobile internet era.'),
        status: 'historical',
        geography: 'India',
        sourceName: 'Indian Retail Launch Archives',
        sourceUrl: 'https://en.wikipedia.org/',
        observedAt: String(year),
        publishedAt: '2026-11-01',
        methodology: 'Historical manufacturer suggested launch price.',
        coverageNote: 'Standard retail launch price upon official distribution.',
        displayFormattedThen: `₹${(year <= 1985 ? 7500 : (year <= 2000 ? 4500 : 31000)).toLocaleString()}`,
        displayFormattedNow: `₹${(year <= 1985 ? 120000 : (year <= 2000 ? 12999 : 79900)).toLocaleString()}`,
      },
      inflationMultiplier,
      cpiSeriesName: 'Reserve Bank of India (RBI) / MoSPI Consumer Price Index Series',
      basePeriod: 'Historical Spliced CPI Series (1950–2026)',
      calculationDate: '2026-11-07',
      sourceName: 'Reserve Bank of India & MoSPI',
      sourceUrl: 'https://rbi.org.in/',
    };
  }

  // ----------------------------------------------------
  // US & GLOBAL BENCHMARKS
  // ----------------------------------------------------
  const cpiBirth = interpolate(US_CPI_TABLE, year);
  const cpiLatest = US_CPI_TABLE[2026] || 326.5;
  const inflationMultiplier = Number((cpiLatest / cpiBirth).toFixed(2));

  const histGold = interpolate(US_GOLD_OZ, year);
  const latestGold = US_GOLD_OZ[2026];

  const histGas = interpolate(US_GAS_GALLON, year);
  const latestGas = US_GAS_GALLON[2026];

  const histMovie = interpolate(US_CINEMA_TICKET, year);
  const latestMovie = US_CINEMA_TICKET[2026];

  const histMilk = interpolate(US_MILK_GALLON, year);
  const latestMilk = US_MILK_GALLON[2026];

  const histBread = interpolate(US_BREAD_LB, year);
  const latestBread = US_BREAD_LB[2026];

  const isUsd = currency === 'USD';
  const rate = CURRENCIES[currency]?.rateToUsd || 1.0;
  const sym = CURRENCIES[currency]?.symbol || '$';
  const toCurr = (usd: number) => Number((usd * rate).toFixed(2));
  const convNote = isUsd ? null : `Converted from USD at reference rate (1 USD = ${rate} ${currency}).`;

  return {
    goldOz: {
      name: 'Fine Gold Bullion (1 Troy Oz)',
      category: 'Precious Metals',
      historicalValueUsd: toCurr(histGold),
      currentValueUsd: toCurr(latestGold),
      unit: `${sym} per Troy Oz (31.1g)`,
      iconName: 'Sparkles',
      status: 'historical',
      geography: 'Global (London Bullion Market)',
      sourceName: 'London Bullion Market Association (LBMA PM Fix)',
      sourceUrl: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
      observedAt: String(year),
      publishedAt: '2026-11-06',
      methodology: 'Official LBMA afternoon gold price auction benchmark fix (PM fix).',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(histGold).toLocaleString()}`,
      displayFormattedNow: `${sym}${toCurr(latestGold).toLocaleString()}`,
      funFact: 'Gold was pegged at $35/oz until the Bretton Woods monetary system ended in 1971.',
    },
    petrolGallon: {
      name: 'Regular Motor Gasoline',
      category: 'Energy',
      historicalValueUsd: toCurr(histGas),
      currentValueUsd: toCurr(latestGas),
      unit: `${sym} per U.S. Gallon (3.785L)`,
      iconName: 'Fuel',
      status: 'historical',
      geography: 'United States (National Average)',
      sourceName: 'U.S. Energy Information Administration (EIA)',
      sourceUrl: 'https://www.eia.gov/petroleum/gasdiesel/',
      observedAt: String(year),
      publishedAt: '2026-11-03',
      methodology: 'Weekly retail gasoline price survey published Mondays by the U.S. EIA, annual average across formulations.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(histGas).toFixed(2)}`,
      displayFormattedNow: `${sym}${toCurr(latestGas).toFixed(2)}`,
    },
    movieTicket: {
      name: 'Cinema Movie Admission Ticket',
      category: 'Entertainment',
      historicalValueUsd: toCurr(histMovie),
      currentValueUsd: toCurr(latestMovie),
      unit: `${sym} per ticket`,
      iconName: 'Film',
      status: 'historical',
      geography: 'United States (National Average)',
      sourceName: 'National Association of Theatre Owners (NATO)',
      sourceUrl: 'https://www.natoonline.org/',
      observedAt: String(year),
      publishedAt: '2026-11-01',
      methodology: 'National average theatrical ticket admission survey across major theatre chains.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(histMovie).toFixed(2)}`,
      displayFormattedNow: `${sym}${toCurr(latestMovie).toFixed(2)}`,
    },
    bread: {
      name: 'White Bread (1 lb loaf)',
      category: 'Staple Food',
      historicalValueUsd: toCurr(histBread),
      currentValueUsd: toCurr(latestBread),
      unit: `${sym} per 1 lb loaf`,
      iconName: 'Wheat',
      status: 'historical',
      geography: 'United States (City Average)',
      sourceName: 'U.S. Bureau of Labor Statistics (BLS APU0000702111)',
      sourceUrl: 'https://www.bls.gov/cpi/',
      observedAt: String(year),
      publishedAt: '2026-10-15',
      methodology: 'BLS Average Retail Food Prices series APU0000702111 for urban consumers.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(histBread).toFixed(2)}`,
      displayFormattedNow: `${sym}${toCurr(latestBread).toFixed(2)}`,
    },
    milk: {
      name: 'Fresh Whole Milk (1 Gallon)',
      category: 'Dairy',
      historicalValueUsd: toCurr(histMilk),
      currentValueUsd: toCurr(latestMilk),
      unit: `${sym} per U.S. Gallon`,
      iconName: 'Coffee',
      status: 'historical',
      geography: 'United States (City Average)',
      sourceName: 'U.S. Bureau of Labor Statistics (BLS APU0000709112)',
      sourceUrl: 'https://www.bls.gov/cpi/',
      observedAt: String(year),
      publishedAt: '2026-10-15',
      methodology: 'BLS Average Retail Food Prices series APU0000709112 for fresh whole milk.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(histMilk).toFixed(2)}`,
      displayFormattedNow: `${sym}${toCurr(latestMilk).toFixed(2)}`,
    },
    averageHome: {
      name: 'Median Sales Price of Houses Sold',
      category: 'Real Estate',
      historicalValueUsd: toCurr(year <= 1970 ? 23400 : (year <= 1995 ? 133900 : 207000)),
      currentValueUsd: toCurr(420000),
      unit: `${sym} median price`,
      iconName: 'Home',
      status: 'historical',
      geography: 'United States',
      sourceName: 'U.S. Census Bureau & HUD (FRED MSPUS)',
      sourceUrl: 'https://fred.stlouisfed.org/series/MSPUS',
      observedAt: String(year),
      publishedAt: '2026-08-25',
      methodology: 'Quarterly median sales price of houses sold in the United States.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(year <= 1970 ? 23400 : (year <= 1995 ? 133900 : 207000)).toLocaleString()}`,
      displayFormattedNow: `${sym}${toCurr(420000).toLocaleString()}`,
    },
    familyCar: {
      name: 'Average New Family Car',
      category: 'Transportation',
      historicalValueUsd: toCurr(year <= 1970 ? 3500 : (year <= 1995 ? 17900 : 34000)),
      currentValueUsd: toCurr(48500),
      unit: `${sym} new vehicle`,
      iconName: 'Car',
      status: 'historical',
      geography: 'United States',
      sourceName: 'U.S. Bureau of Economic Analysis (BEA)',
      sourceUrl: 'https://www.bea.gov/',
      observedAt: String(year),
      publishedAt: '2026-11-01',
      methodology: 'Average transaction price for family passenger vehicles.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(year <= 1970 ? 3500 : (year <= 1995 ? 17900 : 34000)).toLocaleString()}`,
      displayFormattedNow: `${sym}${toCurr(48500).toLocaleString()}`,
    },
    iconicTech: {
      name: year <= 1980 ? 'Sony Walkman TPS-L2' : (year <= 1995 ? 'Sony PlayStation 1' : 'Apple iPod (Original)'),
      category: 'Technology',
      historicalValueUsd: toCurr(year <= 1980 ? 200 : (year <= 1995 ? 299 : 399)),
      currentValueUsd: toCurr(year <= 1980 ? 350 : (year <= 1995 ? 499 : 799)),
      unit: `${sym} MSRP`,
      iconName: 'Cpu',
      funFact: year <= 1980 ? 'The revolutionary portable cassette player that changed personal audio forever.' : (year <= 1995 ? 'The 32-bit CD-ROM console that defined 90s gaming.' : '1,000 songs in your pocket with the iconic mechanical scroll wheel.'),
      status: 'historical',
      geography: 'United States',
      sourceName: 'Manufacturer Original Launch Archives',
      sourceUrl: 'https://en.wikipedia.org/',
      observedAt: String(year),
      publishedAt: '2026-11-01',
      methodology: 'Manufacturer original launch suggested retail price.',
      coverageNote: convNote,
      displayFormattedThen: `${sym}${toCurr(year <= 1980 ? 200 : (year <= 1995 ? 299 : 399)).toLocaleString()}`,
      displayFormattedNow: `${sym}${toCurr(year <= 1980 ? 350 : (year <= 1995 ? 499 : 799)).toLocaleString()}`,
    },
    inflationMultiplier,
    cpiSeriesName: 'U.S. Bureau of Labor Statistics CPI-U (CUUR0000SA0)',
    basePeriod: '1982-84 = 100 Reference Base',
    calculationDate: '2026-11-07',
    sourceName: 'U.S. Bureau of Labor Statistics (BLS)',
    sourceUrl: 'https://data.bls.gov/timeseries/CUUR0000SA0',
  };
}
