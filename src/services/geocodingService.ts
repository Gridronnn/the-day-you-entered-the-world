import { ResolvedLocation } from '../types/history';

const OFFLINE_LOCATION_DB: Record<string, ResolvedLocation> = {
  'london': {
    cityName: 'London',
    country: 'United Kingdom',
    adminRegion: 'Greater London, England',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    elevationMeters: 25,
    weatherStationName: 'London Weather Centre / Heathrow (WMO 03779)',
    isExactMatch: true,
    source: 'Open-Meteo & UK Met Office Archive',
  },
  'kerala': {
    cityName: 'Kerala (Kochi / Thiruvananthapuram)',
    country: 'India',
    adminRegion: 'Kerala State',
    latitude: 9.9312,
    longitude: 76.2673,
    timezone: 'Asia/Kolkata',
    elevationMeters: 5,
    weatherStationName: 'Kochi Naval / IMD Trivandrum Station (WMO 43353)',
    isExactMatch: true,
    source: 'Open-Meteo & IMD India Meteorological Archive',
  },
  'tamil nadu': {
    cityName: 'Tamil Nadu (Chennai)',
    country: 'India',
    adminRegion: 'Tamil Nadu State',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 'Asia/Kolkata',
    elevationMeters: 10,
    weatherStationName: 'Chennai Meenambakkam Observatory (WMO 43279)',
    isExactMatch: true,
    source: 'Open-Meteo & IMD India Meteorological Archive',
  },
  'chennai': {
    cityName: 'Chennai',
    country: 'India',
    adminRegion: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 'Asia/Kolkata',
    elevationMeters: 10,
    weatherStationName: 'Chennai Meenambakkam Observatory (WMO 43279)',
    isExactMatch: true,
    source: 'Open-Meteo & IMD India Meteorological Archive',
  },
  'mumbai': {
    cityName: 'Mumbai',
    country: 'India',
    adminRegion: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    elevationMeters: 14,
    weatherStationName: 'Mumbai Colaba / Santacruz Station (WMO 43003)',
    isExactMatch: true,
    source: 'Open-Meteo & IMD India Meteorological Archive',
  },
  'delhi': {
    cityName: 'New Delhi',
    country: 'India',
    adminRegion: 'Delhi NCR',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
    elevationMeters: 216,
    weatherStationName: 'Safdarjung Observatory (WMO 42182)',
    isExactMatch: true,
    source: 'Open-Meteo & IMD India Meteorological Archive',
  },
  'new york': {
    cityName: 'New York City',
    country: 'United States',
    adminRegion: 'New York',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
    elevationMeters: 10,
    weatherStationName: 'Central Park / JFK International (WMO 72503)',
    isExactMatch: true,
    source: 'Open-Meteo & NOAA NCDC Archive',
  },
  'paris': {
    cityName: 'Paris',
    country: 'France',
    adminRegion: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    elevationMeters: 35,
    weatherStationName: 'Paris-Montsouris Station (WMO 07156)',
    isExactMatch: true,
    source: 'Open-Meteo & Météo-France Archive',
  },
  'tokyo': {
    cityName: 'Tokyo',
    country: 'Japan',
    adminRegion: 'Kanto',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    elevationMeters: 44,
    weatherStationName: 'Tokyo JMA Observatory (WMO 47662)',
    isExactMatch: true,
    source: 'Open-Meteo & Japan Meteorological Agency',
  },
  'sydney': {
    cityName: 'Sydney',
    country: 'Australia',
    adminRegion: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
    elevationMeters: 19,
    weatherStationName: 'Sydney Observatory Hill (WMO 94768)',
    isExactMatch: true,
    source: 'Open-Meteo & Australian Bureau of Meteorology',
  },
  'toronto': {
    cityName: 'Toronto',
    country: 'Canada',
    adminRegion: 'Ontario',
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: 'America/Toronto',
    elevationMeters: 76,
    weatherStationName: 'Toronto Pearson International (WMO 71624)',
    isExactMatch: true,
    source: 'Open-Meteo & Environment Canada',
  },
  'berlin': {
    cityName: 'Berlin',
    country: 'Germany',
    adminRegion: 'Berlin',
    latitude: 52.5200,
    longitude: 13.4050,
    timezone: 'Europe/Berlin',
    elevationMeters: 34,
    weatherStationName: 'Berlin Tempelhof / Dahlem (WMO 10384)',
    isExactMatch: true,
    source: 'Open-Meteo & Deutscher Wetterdienst (DWD)',
  },
};

export async function resolveLocation(inputCity: string): Promise<ResolvedLocation> {
  const query = inputCity.trim();
  const normalized = query.toLowerCase();

  for (const key of Object.keys(OFFLINE_LOCATION_DB)) {
    if (normalized === key || normalized.startsWith(key) || key.startsWith(normalized) || normalized.includes(key)) {
      return OFFLINE_LOCATION_DB[key];
    }
  }

  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        const r = json.results[0];
        return {
          cityName: r.name,
          country: r.country || 'Global Location',
          adminRegion: r.admin1 ? `${r.admin1}, ${r.country || ''}` : r.country || '',
          latitude: Number(r.latitude.toFixed(4)),
          longitude: Number(r.longitude.toFixed(4)),
          timezone: r.timezone || 'UTC',
          elevationMeters: r.elevation ? Math.round(r.elevation) : undefined,
          weatherStationName: `Regional Weather Station for ${r.name} (${r.country || ''})`,
          isExactMatch: true,
          source: 'Open-Meteo Global Geocoder (OpenStreetMap / GeoNames)',
        };
      }
    }
  } catch (err) {
    // Graceful fallback
  }

  return {
    cityName: query || 'Universal Origin',
    country: 'Earth',
    adminRegion: 'Global Coordinates',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'UTC',
    elevationMeters: 25,
    weatherStationName: 'Global Reanalysis Station (ERA5 grid model)',
    isExactMatch: false,
    source: 'Historical Reanalysis Coordinates (Approximate)',
  };
}
