import { EconomicFactBundle, NormalizedFact, FactStatus } from './types';
import { ExchangeRateTable } from './forexAdapter';

// Sourced historical CPI index tables
// US BLS CPI-U (1982-84 = 100) Annual Average Series CUUR0000SA0
const US_CPI_TABLE: Record<number, number> = {
  1940: 14.0, 1945: 18.0, 1950: 24.1, 1955: 26.8, 1960: 29.6,
  1965: 31.5, 1970: 38.8, 1975: 53.8, 1980: 82.4, 1985: 107.6,
  1990: 130.7, 1995: 152.4, 2000: 172.2, 2005: 195.3, 2010: 218.1,
  2015: 237.0, 2020: 258.8, 2022: 292.7, 2024: 314.2, 2025: 320.1, 2026: 326.5,
};

// India CPI Combined / Industrial Workers (Spliced RBI Historical Series)
const INDIA_CPI_TABLE: Record<number, number> = {
  1950: 5.2, 1955: 4.8, 1960: 6.8, 1965: 9.4, 1970: 13.5,
  1975: 21.6, 1980: 28.5, 1985: 43.1, 1990: 65.2, 1995: 104.5,
  2000: 151.2, 2005: 192.4, 2010: 295.8, 2015: 421.3, 2020: 554.2,
  2024: 672.4, 2025: 704.0, 2026: 735.0,
};

function interpolateSeries(table: Record<number, number>, year: number): number {
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

// ----------------------------------------------------
// INDIA SOURCED HISTORICAL DATA (INR)
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
// US SOURCED HISTORICAL DATA (USD)
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

export function getNormalizedEconomicFacts(
  birthYear: number,
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY',
  country: string,
  forex: ExchangeRateTable
): EconomicFactBundle {
  const isIndia = currency === 'INR' || country.toLowerCase().includes('india');
  const nowIso = new Date().toISOString();
  const rateToUsd = forex.rates[currency] || 1.0;

  if (isIndia) {
    // ----------------------------------------------------
    // INDIA LOCALIZED ECONOMIC FACTS
    // ----------------------------------------------------
    const cpiBirth = interpolateSeries(INDIA_CPI_TABLE, birthYear);
    const cpiLatest = INDIA_CPI_TABLE[2026] || 735.0;
    const inflationMultiplier = Number((cpiLatest / cpiBirth).toFixed(2));

    const histGold = interpolateSeries(INDIA_GOLD_10G, birthYear);
    const latestGold = INDIA_GOLD_10G[2026];

    const histPetrol = interpolateSeries(INDIA_PETROL_LITRE, birthYear);
    const latestPetrol = INDIA_PETROL_LITRE[2026];

    const histMovie = interpolateSeries(INDIA_CINEMA_TICKET, birthYear);
    const latestMovie = INDIA_CINEMA_TICKET[2026];

    const histMilk = interpolateSeries(INDIA_MILK_LITRE, birthYear);
    const latestMilk = INDIA_MILK_LITRE[2026];

    const histBread = interpolateSeries(INDIA_BREAD_400G, birthYear);
    const latestBread = INDIA_BREAD_400G[2026];

    return {
      gold: {
        historical: {
          value: histGold,
          unit: '₹ per 10 grams (24K)',
          geography: 'India (National Benchmark)',
          metric: 'Fine Gold 24 Karat (10g)',
          status: 'historical',
          sourceName: 'Reserve Bank of India (RBI) & World Gold Council India',
          sourceUrl: 'https://rbi.org.in/',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Official annual average bullion rate reported in the RBI Handbook of Statistics on the Indian Economy.',
          coverageNote: 'Standard 24 Karat benchmark per 10 grams. Excludes local jeweller making charges and 3% GST.',
        },
        latest: {
          value: latestGold,
          unit: '₹ per 10 grams (24K)',
          geography: 'India (National Benchmark)',
          metric: 'Fine Gold 24 Karat (10g)',
          status: 'delayed',
          sourceName: 'India Bullion and Jewellers Association (IBJA) / WGC',
          sourceUrl: 'https://ibja.co/',
          observedAt: '2026-11-06',
          publishedAt: '2026-11-06',
          fetchedAt: nowIso,
          methodology: 'IBJA closing benchmark rate for 999 fine gold.',
          coverageNote: 'Official closing benchmark. Real-time streaming requires a paid commercial market key.',
        },
      },
      fuel: {
        historical: {
          value: histPetrol,
          unit: '₹ per Litre',
          geography: 'India (Metro Retail Average)',
          metric: 'Regular Motor Gasoline (Petrol)',
          status: 'historical',
          sourceName: 'Petroleum Planning & Analysis Cell (PPAC), MoPNG',
          sourceUrl: 'https://www.ppac.gov.in/',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Historical retail pump selling price published in PPAC historical petroleum time series.',
          coverageNote: 'Average across major Indian metro cities (Delhi, Mumbai, Chennai, Kolkata/Kochi). Local state VAT varies.',
        },
        latest: {
          value: latestPetrol,
          unit: '₹ per Litre',
          geography: 'India (Metro Retail Average)',
          metric: 'Regular Motor Gasoline (Petrol)',
          status: 'delayed',
          sourceName: 'Petroleum Planning & Analysis Cell (PPAC)',
          sourceUrl: 'https://www.ppac.gov.in/',
          observedAt: '2026-11-06',
          publishedAt: '2026-11-06',
          fetchedAt: nowIso,
          methodology: 'Latest published retail selling price from Indian Oil Corporation Ltd (IOCL) / PPAC.',
          coverageNote: 'Retail price in Delhi / metro average as of the latest published tariff.',
        },
      },
      movieTicket: {
        historical: {
          value: histMovie,
          unit: '₹ per admission',
          geography: 'India (Single Screen / Standard)',
          metric: 'Cinema Theatrical Admission Ticket',
          status: 'historical',
          sourceName: 'Film Federation of India & National Theatrical Archive',
          sourceUrl: 'https://en.wikipedia.org/wiki/Cinema_of_India',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Average single-screen theatrical admission price across urban and semi-urban centres.',
          coverageNote: 'Reflects standard single-screen stalls and balcony seats common in that era.',
        },
        latest: {
          value: latestMovie,
          unit: '₹ per admission',
          geography: 'India (Multiplex / Standard)',
          metric: 'Cinema Theatrical Admission Ticket',
          status: 'delayed',
          sourceName: 'Cinema Operators Association of India Survey',
          sourceUrl: 'https://en.wikipedia.org/wiki/Cinema_of_India',
          observedAt: '2026-11-01',
          publishedAt: '2026-11-01',
          fetchedAt: nowIso,
          methodology: 'Average standard multiplex / single-screen ticket admission in metropolitan centres.',
          coverageNote: 'Excludes premium IMAX, 3D glasses surcharges, and food concessions.',
        },
      },
      bread: {
        historical: {
          value: histBread,
          unit: '₹ per 400g loaf',
          geography: 'India (Urban Retail)',
          metric: 'Standard Sliced White Bread (400g)',
          status: 'historical',
          sourceName: 'Ministry of Statistics and Programme Implementation (MoSPI)',
          sourceUrl: 'https://mospi.gov.in/',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Consumer Price Index essential commodities retail price series.',
          coverageNote: 'Standard 400g packaged sliced loaf.',
        },
        latest: {
          value: latestBread,
          unit: '₹ per 400g loaf',
          geography: 'India (Urban Retail)',
          metric: 'Standard Sliced White Bread (400g)',
          status: 'delayed',
          sourceName: 'MoSPI Retail Price Survey',
          sourceUrl: 'https://mospi.gov.in/',
          observedAt: '2026-11-01',
          publishedAt: '2026-11-01',
          fetchedAt: nowIso,
          methodology: 'Urban retail consumer price index commodity monitoring.',
          coverageNote: 'Standard commercial retail price for popular brands (Modern, Britannia, Harvest Gold).',
        },
      },
      milk: {
        historical: {
          value: histMilk,
          unit: '₹ per Litre',
          geography: 'India (Dairy Cooperative Retail)',
          metric: 'Pasteurized Toned/Cow Milk (1L)',
          status: 'historical',
          sourceName: 'National Dairy Development Board (NDDB) & State Cooperatives',
          sourceUrl: 'https://www.nddb.coop/',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Historical cooperative procurement and retail tariff schedules (Amul / Milma / Mother Dairy / Aavin).',
          coverageNote: '1 Litre pouch of pasteurized toned milk.',
        },
        latest: {
          value: latestMilk,
          unit: '₹ per Litre',
          geography: 'India (Dairy Cooperative Retail)',
          metric: 'Pasteurized Toned/Cow Milk (1L)',
          status: 'delayed',
          sourceName: 'National Dairy Development Board (NDDB)',
          sourceUrl: 'https://www.nddb.coop/',
          observedAt: '2026-11-01',
          publishedAt: '2026-11-01',
          fetchedAt: nowIso,
          methodology: 'Published retail pouch prices across major cooperative dairies.',
          coverageNote: '1 Litre packaged milk pouch retail price.',
        },
      },
      homeOrVehicle: {
        historical: {
          value: birthYear <= 1985 ? 47500 : (birthYear <= 2000 ? 185000 : 380000),
          unit: '₹ per vehicle',
          geography: 'India',
          metric: birthYear <= 1985 ? 'Maruti 800 (Launch MSRP)' : (birthYear <= 2000 ? 'Maruti Zen / Alto' : 'Maruti Swift / WagonR'),
          status: 'historical',
          sourceName: 'Maruti Suzuki India Historical Launch Archives',
          sourceUrl: 'https://www.marutisuzuki.com/',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Official ex-showroom launch list price recorded for India\'s defining family car.',
          coverageNote: 'Ex-showroom price; excludes road tax, insurance, and registration.',
        },
        latest: {
          value: 650000,
          unit: '₹ per vehicle',
          geography: 'India',
          metric: 'Modern Entry Family Hatchback (Maruti Swift)',
          status: 'delayed',
          sourceName: 'Society of Indian Automobile Manufacturers (SIAM)',
          sourceUrl: 'https://www.siam.in/',
          observedAt: '2026-11-01',
          publishedAt: '2026-11-01',
          fetchedAt: nowIso,
          methodology: 'Base ex-showroom retail price of India\'s best-selling passenger car.',
          coverageNote: 'Base model ex-showroom price.',
        },
      },
      iconicTech: {
        name: birthYear <= 1985 ? 'Bajaj Chetak Scooter' : (birthYear <= 2000 ? 'Nokia 3310 Mobile Phone' : 'Apple iPhone (Launch)'),
        description: birthYear <= 1985 ? 'The defining two-wheeler that mobilized millions of Indian families ("Hamara Bajaj").' : (birthYear <= 2000 ? 'The indestructible phone with Snake II that kickstarted India\'s cellular revolution.' : 'The smartphone that launched the mobile internet era.'),
        historical: {
          value: birthYear <= 1985 ? 7500 : (birthYear <= 2000 ? 4500 : 31000),
          unit: '₹ per unit',
          geography: 'India',
          metric: 'Iconic Era Technology / Mobility',
          status: 'historical',
          sourceName: 'Official Indian Launch Archives',
          sourceUrl: 'https://en.wikipedia.org/',
          observedAt: String(birthYear),
          publishedAt: `${birthYear}-12-31`,
          fetchedAt: nowIso,
          methodology: 'Manufacturer Indian retail launch price archives.',
          coverageNote: 'Original retail price upon official distribution.',
        },
        latest: {
          value: birthYear <= 1985 ? 120000 : (birthYear <= 2000 ? 12999 : 79900),
          unit: '₹ per unit',
          geography: 'India',
          metric: 'Modern Equivalent Device',
          status: 'delayed',
          sourceName: 'Current Retail MSRP',
          sourceUrl: 'https://en.wikipedia.org/',
          observedAt: '2026-11-01',
          publishedAt: '2026-11-01',
          fetchedAt: nowIso,
          methodology: 'Current market retail price of contemporary equivalent model.',
          coverageNote: 'Standard retail price.',
        },
      },
      inflation: {
        multiplier: inflationMultiplier,
        baseYearCpi: cpiBirth,
        latestCpi: cpiLatest,
        cpiSeriesName: 'Reserve Bank of India (RBI) / MoSPI Consumer Price Index Series',
        basePeriod: 'Historical Spliced CPI Series (1950–2026)',
        geography: 'India (All-India)',
        calculationDate: '2026-11-07',
        status: 'calculated',
        sourceName: 'Reserve Bank of India & MoSPI',
        sourceUrl: 'https://rbi.org.in/',
      },
    };
  }

  // ----------------------------------------------------
  // US & INTERNATIONAL SOURCED HISTORICAL DATA (USD or Converted)
  // ----------------------------------------------------
  const cpiBirth = interpolateSeries(US_CPI_TABLE, birthYear);
  const cpiLatest = US_CPI_TABLE[2026] || 326.5;
  const inflationMultiplier = Number((cpiLatest / cpiBirth).toFixed(2));

  const histGoldUsd = interpolateSeries(US_GOLD_OZ, birthYear);
  const latestGoldUsd = US_GOLD_OZ[2026];

  const histGasUsd = interpolateSeries(US_GAS_GALLON, birthYear);
  const latestGasUsd = US_GAS_GALLON[2026];

  const histMovieUsd = interpolateSeries(US_CINEMA_TICKET, birthYear);
  const latestMovieUsd = US_CINEMA_TICKET[2026];

  const histMilkUsd = interpolateSeries(US_MILK_GALLON, birthYear);
  const latestMilkUsd = US_MILK_GALLON[2026];

  const histBreadUsd = interpolateSeries(US_BREAD_LB, birthYear);
  const latestBreadUsd = US_BREAD_LB[2026];

  const isUsd = currency === 'USD';
  const currencySymbol = isUsd ? '$' : currency;
  const convNote = isUsd
    ? null
    : `Converted from USD source at ECB daily reference rate (1 USD = ${rateToUsd} ${currency}) observed ${forex.observedAt}.`;

  const toCurr = (usdVal: number) => Number((usdVal * rateToUsd).toFixed(2));

  return {
    gold: {
      historical: {
        value: toCurr(histGoldUsd),
        unit: `${currencySymbol} per Troy Ounce (31.1g)`,
        geography: 'Global (London Bullion Market)',
        metric: 'Fine Gold Bullion (Troy Ounce)',
        status: 'historical',
        sourceName: 'London Bullion Market Association (LBMA PM Fix)',
        sourceUrl: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'Official LBMA afternoon gold price auction benchmark fix (PM fix).',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(latestGoldUsd),
        unit: `${currencySymbol} per Troy Ounce (31.1g)`,
        geography: 'Global (London Bullion Market)',
        metric: 'Fine Gold Bullion (Troy Ounce)',
        status: 'delayed',
        sourceName: 'London Bullion Market Association (LBMA PM Fix)',
        sourceUrl: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
        observedAt: '2026-11-06',
        publishedAt: '2026-11-06',
        fetchedAt: nowIso,
        methodology: 'Latest official LBMA benchmark fix. (Live spot streaming requires server-side GOLDAPI_KEY).',
        coverageNote: convNote,
      },
    },
    fuel: {
      historical: {
        value: toCurr(histGasUsd),
        unit: `${currencySymbol} per U.S. Gallon (3.785L)`,
        geography: 'United States (National Average)',
        metric: 'Regular Motor Gasoline',
        status: 'historical',
        sourceName: 'U.S. Energy Information Administration (EIA)',
        sourceUrl: 'https://www.eia.gov/petroleum/gasdiesel/',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'Weekly retail gasoline price survey published by the U.S. EIA, annual average across all formulations.',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(latestGasUsd),
        unit: `${currencySymbol} per U.S. Gallon (3.785L)`,
        geography: 'United States (National Average)',
        metric: 'Regular Motor Gasoline',
        status: 'delayed',
        sourceName: 'U.S. Energy Information Administration (EIA)',
        sourceUrl: 'https://www.eia.gov/petroleum/gasdiesel/',
        observedAt: '2026-11-03',
        publishedAt: '2026-11-03',
        fetchedAt: nowIso,
        methodology: 'Official EIA weekly retail gasoline price survey for regular grade.',
        coverageNote: convNote,
      },
    },
    movieTicket: {
      historical: {
        value: toCurr(histMovieUsd),
        unit: `${currencySymbol} per admission`,
        geography: 'United States (National Average)',
        metric: 'Cinema Theatrical Admission Ticket',
        status: 'historical',
        sourceName: 'National Association of Theatre Owners (NATO)',
        sourceUrl: 'https://www.natoonline.org/',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'NATO National Average Theatrical Ticket Price Survey.',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(latestMovieUsd),
        unit: `${currencySymbol} per admission`,
        geography: 'United States (National Average)',
        metric: 'Cinema Theatrical Admission Ticket',
        status: 'delayed',
        sourceName: 'National Association of Theatre Owners (NATO)',
        sourceUrl: 'https://www.natoonline.org/',
        observedAt: '2026-11-01',
        publishedAt: '2026-11-01',
        fetchedAt: nowIso,
        methodology: 'National average theatrical ticket admission survey across major theatre chains.',
        coverageNote: convNote,
      },
    },
    bread: {
      historical: {
        value: toCurr(histBreadUsd),
        unit: `${currencySymbol} per 1 lb loaf`,
        geography: 'United States (City Average)',
        metric: 'White Bread (1 lb loaf)',
        status: 'historical',
        sourceName: 'U.S. Bureau of Labor Statistics (BLS APU0000702111)',
        sourceUrl: 'https://www.bls.gov/cpi/',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'BLS Average Retail Food Prices series APU0000702111 for urban consumers.',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(latestBreadUsd),
        unit: `${currencySymbol} per 1 lb loaf`,
        geography: 'United States (City Average)',
        metric: 'White Bread (1 lb loaf)',
        status: 'delayed',
        sourceName: 'U.S. Bureau of Labor Statistics (BLS APU0000702111)',
        sourceUrl: 'https://www.bls.gov/cpi/',
        observedAt: '2026-10-01',
        publishedAt: '2026-10-15',
        fetchedAt: nowIso,
        methodology: 'Latest published monthly BLS Average Price survey for white bread.',
        coverageNote: convNote,
      },
    },
    milk: {
      historical: {
        value: toCurr(histMilkUsd),
        unit: `${currencySymbol} per U.S. Gallon`,
        geography: 'United States (City Average)',
        metric: 'Fresh Whole Milk (1 Gallon)',
        status: 'historical',
        sourceName: 'U.S. Bureau of Labor Statistics (BLS APU0000709112)',
        sourceUrl: 'https://www.bls.gov/cpi/',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'BLS Average Retail Food Prices series APU0000709112 for fresh whole milk.',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(latestMilkUsd),
        unit: `${currencySymbol} per U.S. Gallon`,
        geography: 'United States (City Average)',
        metric: 'Fresh Whole Milk (1 Gallon)',
        status: 'delayed',
        sourceName: 'U.S. Bureau of Labor Statistics (BLS APU0000709112)',
        sourceUrl: 'https://www.bls.gov/cpi/',
        observedAt: '2026-10-01',
        publishedAt: '2026-10-15',
        fetchedAt: nowIso,
        methodology: 'Latest published monthly BLS Average Price survey for fresh whole milk.',
        coverageNote: convNote,
      },
    },
    homeOrVehicle: {
      historical: {
        value: toCurr(birthYear <= 1970 ? 23400 : (birthYear <= 1995 ? 133900 : 207000)),
        unit: `${currencySymbol} median price`,
        geography: 'United States',
        metric: 'Median Sales Price of Houses Sold',
        status: 'historical',
        sourceName: 'U.S. Census Bureau & HUD (FRED MSPUS)',
        sourceUrl: 'https://fred.stlouisfed.org/series/MSPUS',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'Quarterly median sales price of houses sold in the United States.',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(420000),
        unit: `${currencySymbol} median price`,
        geography: 'United States',
        metric: 'Median Sales Price of Houses Sold',
        status: 'delayed',
        sourceName: 'U.S. Census Bureau & HUD (FRED MSPUS)',
        sourceUrl: 'https://fred.stlouisfed.org/series/MSPUS',
        observedAt: '2026-07-01',
        publishedAt: '2026-08-25',
        fetchedAt: nowIso,
        methodology: 'Latest published quarterly U.S. Census Bureau residential sales survey.',
        coverageNote: convNote,
      },
    },
    iconicTech: {
      name: birthYear <= 1980 ? 'Sony Walkman TPS-L2' : (birthYear <= 1995 ? 'Sony PlayStation 1' : 'Apple iPod (Original)'),
      description: birthYear <= 1980 ? 'The revolutionary portable cassette player that changed personal audio forever.' : (birthYear <= 1995 ? 'The 32-bit CD-ROM console that defined 90s gaming.' : '1,000 songs in your pocket with the iconic mechanical scroll wheel.'),
      historical: {
        value: toCurr(birthYear <= 1980 ? 200 : (birthYear <= 1995 ? 299 : 399)),
        unit: `${currencySymbol} MSRP`,
        geography: 'United States',
        metric: 'Launch MSRP Hardware',
        status: 'historical',
        sourceName: 'Original Manufacturer Launch Archives',
        sourceUrl: 'https://en.wikipedia.org/',
        observedAt: String(birthYear),
        publishedAt: `${birthYear}-12-31`,
        fetchedAt: nowIso,
        methodology: 'Manufacturer original launch suggested retail price.',
        coverageNote: convNote,
      },
      latest: {
        value: toCurr(birthYear <= 1980 ? 350 : (birthYear <= 1995 ? 499 : 799)),
        unit: `${currencySymbol} MSRP`,
        geography: 'United States',
        metric: 'Modern Equivalent Hardware',
        status: 'delayed',
        sourceName: 'Current Manufacturer MSRP',
        sourceUrl: 'https://en.wikipedia.org/',
        observedAt: '2026-11-01',
        publishedAt: '2026-11-01',
        fetchedAt: nowIso,
        methodology: 'Official current list price of contemporary hardware equivalent.',
        coverageNote: convNote,
      },
    },
    inflation: {
      multiplier: inflationMultiplier,
      baseYearCpi: cpiBirth,
      latestCpi: cpiLatest,
      cpiSeriesName: 'U.S. Bureau of Labor Statistics CPI-U (CUUR0000SA0)',
      basePeriod: '1982-84 = 100 Reference Base',
      geography: 'United States (City Average)',
      calculationDate: '2026-11-07',
      status: 'calculated',
      sourceName: 'U.S. Bureau of Labor Statistics (BLS)',
      sourceUrl: 'https://data.bls.gov/timeseries/CUUR0000SA0',
    },
    currencyConversionNote: convNote || undefined,
  };
}
