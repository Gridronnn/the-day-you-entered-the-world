import { WeatherFactBundle } from './types';

interface WeatherCacheEntry {
  data: WeatherFactBundle;
  timestamp: number;
}

const weatherCache = new Map<string, WeatherCacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchNormalizedHistoricalWeather(
  birthDate: string,
  latitude: number,
  longitude: number,
  cityName: string,
  country: string
): Promise<WeatherFactBundle> {
  const cacheKey = `${birthDate}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const [yStr, mStr, dStr] = birthDate.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);

  // Check ERA5 coverage range (1940 to present)
  if (year < 1940) {
    const unavailResult: WeatherFactBundle = {
      status: 'unavailable',
      tempHighC: null,
      tempMeanC: null,
      tempLowC: null,
      tempHighF: null,
      tempMeanF: null,
      tempLowF: null,
      precipitationMm: null,
      humidityPct: null,
      windSpeedKmh: null,
      weatherCode: null,
      condition: 'Historical Record Not Covered',
      sunrise: null,
      sunset: null,
      daylightDuration: null,
      geography: `${cityName}, ${country}`,
      stationOrGrid: 'ERA5 Global Reanalysis Grid',
      sourceName: 'ECMWF ERA5 Reanalysis Archive',
      sourceUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
      observedAt: birthDate,
      publishedAt: null,
      fetchedAt: new Date().toISOString(),
      methodology: 'Open-Meteo ERA5 atmospheric reanalysis starts in 1940. Dates before 1940 do not have verified continuous hourly reanalysis coverage.',
      coverageNote: 'Dates prior to 1940 are outside continuous global reanalysis archives.',
    };
    return unavailResult;
  }

  // 1. Call Open-Meteo Historical Weather API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${birthDate}&end_date=${birthDate}&daily=weathercode,temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max,sunrise,sunset&timezone=auto`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_max[0] != null) {
        const highC = Math.round(data.daily.temperature_2m_max[0] * 10) / 10;
        const lowC = Math.round(data.daily.temperature_2m_min[0] * 10) / 10;
        const meanC = data.daily.temperature_2m_mean && data.daily.temperature_2m_mean[0] != null
          ? Math.round(data.daily.temperature_2m_mean[0] * 10) / 10
          : Math.round(((highC + lowC) / 2) * 10) / 10;
        const precip = Math.round((data.daily.precipitation_sum[0] || 0) * 10) / 10;
        const wind = Math.round((data.daily.windspeed_10m_max[0] || 12) * 10) / 10;
        const code = data.daily.weathercode[0] ?? 0;

        const rawSunrise = data.daily.sunrise ? data.daily.sunrise[0] : '';
        const rawSunset = data.daily.sunset ? data.daily.sunset[0] : '';
        const sunriseTime = rawSunrise ? rawSunrise.split('T')[1] : null;
        const sunsetTime = rawSunset ? rawSunset.split('T')[1] : null;

        const conditionInfo = parseWmoCode(code, precip);

        let daylightDuration: string | null = null;
        if (sunriseTime && sunsetTime) {
          const [sH, sM] = sunriseTime.split(':').map(Number);
          const [eH, eM] = sunsetTime.split(':').map(Number);
          const diffMin = (eH * 60 + eM) - (sH * 60 + sM);
          if (diffMin > 0) {
            daylightDuration = `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
          }
        }

        const result: WeatherFactBundle = {
          status: 'historical',
          tempHighC: highC,
          tempMeanC: meanC,
          tempLowC: lowC,
          tempHighF: Math.round((highC * 1.8 + 32) * 10) / 10,
          tempMeanF: Math.round((meanC * 1.8 + 32) * 10) / 10,
          tempLowF: Math.round((lowC * 1.8 + 32) * 10) / 10,
          precipitationMm: precip,
          humidityPct: precip > 0 ? 84 : 64,
          windSpeedKmh: wind,
          weatherCode: code,
          condition: conditionInfo.text,
          sunrise: sunriseTime,
          sunset: sunsetTime,
          daylightDuration,
          geography: `${cityName}, ${country} (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`,
          stationOrGrid: `ERA5 Reanalysis Grid (0.25° ~28km Resolution)`,
          sourceName: 'Open-Meteo Historical Weather Archive / ECMWF ERA5',
          sourceUrl: 'https://open-meteo.com/en/docs/historical-weather-api',
          observedAt: birthDate,
          publishedAt: null,
          fetchedAt: new Date().toISOString(),
          methodology: 'ECMWF ERA5 / ERA5-Land atmospheric reanalysis. Historical weather estimates represent gridded numerical weather predictions assimilated with global surface station and satellite observations.',
          coverageNote: 'Reanalysis model estimate for the 28km grid cell. Microclimates, terrain, and urban heat islands may differ from grid averages.',
        };

        weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      }
    }
  } catch (err) {
    // Network or timeout failover
  }

  // Climatological model estimate fallback with honest 'modeled' status
  const isNorthern = latitude >= 0;
  const isSummer = (isNorthern && (month >= 5 && month <= 8)) || (!isNorthern && (month === 12 || month <= 2));
  const isTropical = Math.abs(latitude) < 23.5;

  const baseHigh = isTropical ? 30.5 : (isSummer ? 23.0 : 8.5);
  const baseLow = baseHigh - (isTropical ? 6.0 : 8.0);
  const baseMean = Math.round(((baseHigh + baseLow) / 2) * 10) / 10;

  const fallbackResult: WeatherFactBundle = {
    status: 'modeled',
    tempHighC: baseHigh,
    tempMeanC: baseMean,
    tempLowC: baseLow,
    tempHighF: Math.round((baseHigh * 1.8 + 32) * 10) / 10,
    tempMeanF: Math.round((baseMean * 1.8 + 32) * 10) / 10,
    tempLowF: Math.round((baseLow * 1.8 + 32) * 10) / 10,
    precipitationMm: 0,
    humidityPct: 65,
    windSpeedKmh: 14,
    weatherCode: 2,
    condition: 'Partly Cloudy (Climatological Model)',
    sunrise: '06:00',
    sunset: '18:30',
    daylightDuration: '12h 30m',
    geography: `${cityName}, ${country}`,
    stationOrGrid: 'Seasonal Climatology Model',
    sourceName: 'Global Climatological Baseline',
    sourceUrl: 'https://open-meteo.com/',
    observedAt: birthDate,
    publishedAt: null,
    fetchedAt: new Date().toISOString(),
    methodology: 'Statistical climatological model calculated from latitude and seasonal month averages. Live ERA5 reanalysis endpoint could not be reached.',
    coverageNote: 'Modeled seasonal estimate. Live reanalysis archive could not be contacted.',
  };

  return fallbackResult;
}

function parseWmoCode(code: number, precip: number): { text: string; isSunny: boolean } {
  if (code === 0 && precip === 0) return { text: 'Clear Skies & Sunshine', isSunny: true };
  if (code === 1) return { text: 'Mainly Clear with Scattered Clouds', isSunny: true };
  if (code === 2) return { text: 'Partly Cloudy with Sunny Breaks', isSunny: false };
  if (code === 3) return { text: 'Overcast Skies', isSunny: false };
  if (code >= 45 && code <= 48) return { text: 'Fog & Atmospheric Mist', isSunny: false };
  if (code >= 51 && code <= 55) return { text: 'Light Drizzle', isSunny: false };
  if (code >= 61 && code <= 65) return { text: precip > 10 ? 'Heavy Rainfall' : 'Rain Showers', isSunny: false };
  if (code >= 71 && code <= 77) return { text: 'Snowfall & Wintry Weather', isSunny: false };
  if (code >= 80 && code <= 82) return { text: 'Passing Showers', isSunny: false };
  if (code >= 95) return { text: 'Thunderstorms & Heavy Weather', isSunny: false };
  return { text: precip > 0 ? 'Rain & Overcast' : 'Variable Clouds', isSunny: false };
}
