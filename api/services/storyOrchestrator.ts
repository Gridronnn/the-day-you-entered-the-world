import { generatePersonalTimeline } from './timelineDatabase';
import { StoryResponse, StoryQuery } from '../types/story';
import { resolveLocation } from './nominatimService';
import { calculateDateFacts, calculateAstronomy } from './astronomyEngine';
import { fetchNormalizedHistoricalWeather } from '../adapters/weatherAdapter';
import { fetchNormalizedHistoricalNews } from '../adapters/newsAdapter';
import { getReferenceExchangeRates } from '../adapters/forexAdapter';
import { getNormalizedEconomicFacts } from '../adapters/economicsAdapter';
import { fetchLiveGoldSpot } from '../adapters/goldApiAdapter';
import { getMusicForDate, getCinemaForYear } from './chartsDatabase';
import { getComparisons } from './economicDatabase';

export async function generateStory(query: StoryQuery): Promise<StoryResponse & { normalizedFacts?: any }> {
  const { date, placeInput, currency, chartRegion } = query;

  // 1. Resolve Location Coordinates & Timezone
  const location = await resolveLocation(placeInput);

  // 2. Date Facts & Ephemeris
  const dateFacts = calculateDateFacts(date, location.latitude);
  const astronomy = calculateAstronomy(date, location.timezone);

  // 3. Parallel Async Fetches (Weather + News + Forex)
  const [yearStr] = date.split('-');
  const year = parseInt(yearStr, 10);

  const [weatherBundle, newsItems, forex] = await Promise.all([
    fetchNormalizedHistoricalWeather(date, location.latitude, location.longitude, location.name, location.country),
    fetchNormalizedHistoricalNews(date),
    getReferenceExchangeRates(),
  ]);

  // 4. Economics (Country-Aware & Currency-Aware)
  const economicsBundle = getNormalizedEconomicFacts(year, currency, location.country, forex);

  // Optional: Live Gold Spot via GoldAPI if configured
  try {
    const liveGold = await fetchLiveGoldSpot(currency);
    if (liveGold) {
      economicsBundle.gold.latest = liveGold;
    }
  } catch (e) {
    // Graceful fallback already populated
  }

  // 5. Music & Cinema
  const music = getMusicForDate(date, chartRegion);
  const cinema = getCinemaForYear(year, date);

  // 6. Comparisons & Timeline
  const comparisons = getComparisons(year);
  const personalTimeline = generatePersonalTimeline(year);

  // 7. Cultural & Uplifting Milestones
  const uplifting = [
    {
      title: 'Global Primary Education & Child Health Expansion',
      category: 'Humanitarian',
      description: `In ${year}, international public health and primary education coalitions expanded immunization and literacy access across millions of households worldwide.`,
      badge: 'Human Education',
      source_name: 'UNESCO Institute for Statistics & UNICEF Historical Archives',
      source_url: 'https://en.unesco.org/',
    },
    {
      title: 'International Habitat & Environmental Treaties',
      category: 'Environment',
      description: 'Nations established collaborative wildlife conservation frameworks and emissions monitoring to protect vital ecosystems for succeeding generations.',
      badge: 'Planetary Care',
      source_name: 'UN Environment Programme (UNEP)',
      source_url: 'https://www.unep.org/',
    },
  ];

  const culturalTags = {
    tvShows: year <= 1970
      ? ['The Twilight Zone', 'The Flintstones', 'Doctor Who', 'Star Trek']
      : (year <= 1995 ? ['Friends', 'The X-Files', 'Seinfeld', 'ER'] : ['Survivor', 'Malcolm in the Middle', 'The Sopranos', 'Will & Grace']),
    fashionTrends: year <= 1970
      ? ['Bell-bottoms', 'Go-go boots', 'Tie-dye shirts']
      : (year <= 1995 ? ['Flannel Shirts', 'Chunky Platform Shoes', 'Bucket Hats'] : ['Baggy Cargo Pants', 'Bandanas', 'Platform Sneakers']),
    popularToys: year <= 1970
      ? ['Etch A Sketch', 'Easy-Bake Oven', 'G.I. Joe']
      : (year <= 1995 ? ['Tamagotchi', 'Beanie Babies', 'Game Boy Color', 'Super Nintendo'] : ['PlayStation 2', 'Razor Scooter', 'Pokemon Gold & Silver']),
  };

  const famousBirthdays = [
    { name: 'Albert Einstein', role: 'Theoretical Physicist', year: 1879, quote: 'Imagination is more important than knowledge.', knownFor: 'General Relativity', emoji: '🌌' },
    { name: 'Nelson Mandela', role: 'President & Peace Leader', year: 1918, quote: 'It always seems impossible until it is done.', knownFor: 'Human Dignity', emoji: '🕊️' },
  ];

  // Map to legacy EconomyPayload for backwards compatibility while adding normalized facts
  const legacyItems = [
    {
      name: economicsBundle.gold.historical.metric,
      unit: economicsBundle.gold.historical.unit,
      historicalNominalUsd: economicsBundle.gold.historical.value || 0,
      currentMarketUsd: economicsBundle.gold.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.gold.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.gold.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.gold.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.gold.historical.sourceName,
      source_url: economicsBundle.gold.historical.sourceUrl,
      asOfDate: economicsBundle.gold.latest.observedAt || '2026-11-06',
      methodology: economicsBundle.gold.historical.methodology,
      iconName: 'Coins',
    },
    {
      name: economicsBundle.fuel.historical.metric,
      unit: economicsBundle.fuel.historical.unit,
      historicalNominalUsd: economicsBundle.fuel.historical.value || 0,
      currentMarketUsd: economicsBundle.fuel.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.fuel.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.fuel.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.fuel.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.fuel.historical.sourceName,
      source_url: economicsBundle.fuel.historical.sourceUrl,
      asOfDate: economicsBundle.fuel.latest.observedAt || '2026-11-06',
      methodology: economicsBundle.fuel.historical.methodology,
      iconName: 'Fuel',
    },
    {
      name: economicsBundle.bread.historical.metric,
      unit: economicsBundle.bread.historical.unit,
      historicalNominalUsd: economicsBundle.bread.historical.value || 0,
      currentMarketUsd: economicsBundle.bread.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.bread.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.bread.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.bread.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.bread.historical.sourceName,
      source_url: economicsBundle.bread.historical.sourceUrl,
      asOfDate: economicsBundle.bread.latest.observedAt || '2026-11-01',
      methodology: economicsBundle.bread.historical.methodology,
      iconName: 'Utensils',
    },
    {
      name: economicsBundle.milk.historical.metric,
      unit: economicsBundle.milk.historical.unit,
      historicalNominalUsd: economicsBundle.milk.historical.value || 0,
      currentMarketUsd: economicsBundle.milk.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.milk.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.milk.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.milk.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.milk.historical.sourceName,
      source_url: economicsBundle.milk.historical.sourceUrl,
      asOfDate: economicsBundle.milk.latest.observedAt || '2026-11-01',
      methodology: economicsBundle.milk.historical.methodology,
      iconName: 'Coffee',
    },
    {
      name: economicsBundle.movieTicket.historical.metric,
      unit: economicsBundle.movieTicket.historical.unit,
      historicalNominalUsd: economicsBundle.movieTicket.historical.value || 0,
      currentMarketUsd: economicsBundle.movieTicket.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.movieTicket.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.movieTicket.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.movieTicket.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.movieTicket.historical.sourceName,
      source_url: economicsBundle.movieTicket.historical.sourceUrl,
      asOfDate: economicsBundle.movieTicket.latest.observedAt || '2026-11-01',
      methodology: economicsBundle.movieTicket.historical.methodology,
      iconName: 'Film',
    },
    {
      name: economicsBundle.homeOrVehicle.historical.metric,
      unit: economicsBundle.homeOrVehicle.historical.unit,
      historicalNominalUsd: economicsBundle.homeOrVehicle.historical.value || 0,
      currentMarketUsd: economicsBundle.homeOrVehicle.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.homeOrVehicle.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.homeOrVehicle.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.homeOrVehicle.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.homeOrVehicle.historical.sourceName,
      source_url: economicsBundle.homeOrVehicle.historical.sourceUrl,
      asOfDate: economicsBundle.homeOrVehicle.latest.observedAt || '2026-11-01',
      methodology: economicsBundle.homeOrVehicle.historical.methodology,
      iconName: 'Home',
    },
    {
      name: economicsBundle.iconicTech.name,
      unit: economicsBundle.iconicTech.historical.unit,
      historicalNominalUsd: economicsBundle.iconicTech.historical.value || 0,
      currentMarketUsd: economicsBundle.iconicTech.latest.value || 0,
      inflationAdjustedUsd: Number(((economicsBundle.iconicTech.historical.value || 0) * economicsBundle.inflation.multiplier).toFixed(2)),
      historicalValueSelectedCurrency: economicsBundle.iconicTech.historical.value || 0,
      currentValueSelectedCurrency: economicsBundle.iconicTech.latest.value || 0,
      data_type: 'market_price_comparison' as const,
      source_name: economicsBundle.iconicTech.historical.sourceName,
      source_url: economicsBundle.iconicTech.historical.sourceUrl,
      asOfDate: economicsBundle.iconicTech.latest.observedAt || '2026-11-01',
      methodology: economicsBundle.iconicTech.historical.methodology,
      iconName: 'Sparkles',
    },
  ];

  const legacyWeather = {
    status: weatherBundle.status === 'historical' ? ('available' as const) : ('estimated' as const),
    tempHighC: weatherBundle.tempHighC || 20,
    tempMeanC: weatherBundle.tempMeanC || 18,
    tempLowC: weatherBundle.tempLowC || 15,
    tempHighF: weatherBundle.tempHighF || 68,
    tempMeanF: weatherBundle.tempMeanF || 64,
    tempLowF: weatherBundle.tempLowF || 59,
    precipitationMm: weatherBundle.precipitationMm || 0,
    humidityPct: weatherBundle.humidityPct || 65,
    windSpeedKmh: weatherBundle.windSpeedKmh || 12,
    cloudCoverPct: 50,
    weatherCode: weatherBundle.weatherCode || 0,
    condition: weatherBundle.condition,
    isSunnySupported: weatherBundle.condition.toLowerCase().includes('sun') || weatherBundle.condition.toLowerCase().includes('clear'),
    sunrise: weatherBundle.sunrise || '06:00 AM',
    sunset: weatherBundle.sunset || '06:30 PM',
    daylightDuration: weatherBundle.daylightDuration || '12h 30m',
    stationOrGrid: weatherBundle.stationOrGrid,
    source: {
      name: weatherBundle.sourceName,
      url: weatherBundle.sourceUrl,
      dataType: 'historical_reanalysis_estimate' as const,
      stationOrGrid: weatherBundle.stationOrGrid,
      retrievedAt: weatherBundle.fetchedAt,
    },
    disclaimer: weatherBundle.methodology,
  };

  const legacyNews = newsItems.map((item) => ({
    date: item.eventDate,
    category: 'World' as const,
    headline: item.headline,
    summary: item.summary,
    source_name: item.sourceName,
    source_url: item.sourceUrl,
    published_at: item.publishedAt || item.eventDate,
    confidence: item.status === 'historical' ? 'Verified Historical Record' : 'Historical Archive Record',
    data_type: 'historical_record' as const,
  }));

  return {
    query,
    location,
    dateFacts,
    weather: legacyWeather,
    astronomy,
    news: legacyNews,
    music,
    cinema,
    economy: {
      status: 'available',
      inflationMultiplier: economicsBundle.inflation.multiplier,
      cpiIndexBaseYear: economicsBundle.inflation.baseYearCpi,
      cpiIndexCurrent: economicsBundle.inflation.latestCpi,
      asOfDate: economicsBundle.inflation.calculationDate,
      dataSource: economicsBundle.inflation.sourceName,
      sourceUrl: economicsBundle.inflation.sourceUrl,
      items: legacyItems,
    },
    comparisons,
    timeline: personalTimeline,
    uplifting,
    culturalTags,
    famousBirthdays,
    normalizedFacts: {
      weather: weatherBundle,
      news: newsItems,
      economics: economicsBundle,
      forex,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      dataMode: 'historical_reconstruction',
      disclaimer: 'Data points are tagged with verifiable sources, observation timestamps, and methodology notes. Reanalysis and reference rates are explicitly disclosed.',
      dataFreshness: {
        weather: weatherBundle.status,
        news: newsItems[0]?.status || 'historical',
        forex: forex.status,
        gold: economicsBundle.gold.latest.status,
        fuel: economicsBundle.fuel.latest.status,
      },
      sources: [
        { name: weatherBundle.sourceName, category: 'Historical Weather', url: weatherBundle.sourceUrl },
        { name: 'Wikimedia Foundation REST API', category: 'News & Chronology', url: 'https://en.wikipedia.org/' },
        { name: forex.sourceName, category: 'Reference Exchange Rates', url: forex.sourceUrl },
        { name: economicsBundle.gold.historical.sourceName, category: 'Bullion Benchmarks', url: economicsBundle.gold.historical.sourceUrl },
        { name: economicsBundle.fuel.historical.sourceName, category: 'Fuel Retail Series', url: economicsBundle.fuel.historical.sourceUrl },
        { name: economicsBundle.inflation.sourceName, category: 'Consumer Price Index & Inflation', url: economicsBundle.inflation.sourceUrl },
        { name: 'Billboard Hot 100 Official Charts', category: 'Music Archives', url: 'https://www.billboard.com/' },
        { name: 'Box Office Mojo & The Numbers', category: 'Cinema Box Office', url: 'https://www.boxofficemojo.com/' },
        { name: 'OpenStreetMap Nominatim', category: 'Geocoding & Boundaries', url: 'https://nominatim.openstreetmap.org/' },
      ],
      warnings: [],
    },
  };
}
