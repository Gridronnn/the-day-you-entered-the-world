import { HistoricalWeather } from '../types/history';

interface CityClimate {
  name: string;
  country: string;
  lat: number;
  lon: number;
  baseTempC: number;
  tempRange: number;
  peakSummerMonth: number;
}

const CITY_DATABASE: Record<string, CityClimate> = {
  'new york': { name: 'New York', country: 'United States', lat: 40.71, lon: -74.00, baseTempC: 13, tempRange: 15, peakSummerMonth: 7 },
  'london': { name: 'London', country: 'United Kingdom', lat: 51.50, lon: -0.12, baseTempC: 11, tempRange: 8, peakSummerMonth: 7 },
  'tokyo': { name: 'Tokyo', country: 'Japan', lat: 35.67, lon: 139.65, baseTempC: 16, tempRange: 12, peakSummerMonth: 8 },
  'paris': { name: 'Paris', country: 'France', lat: 48.85, lon: 2.35, baseTempC: 12, tempRange: 9, peakSummerMonth: 7 },
  'mumbai': { name: 'Mumbai', country: 'India', lat: 19.07, lon: 72.87, baseTempC: 27, tempRange: 4, peakSummerMonth: 5 },
  'delhi': { name: 'Delhi', country: 'India', lat: 28.61, lon: 77.20, baseTempC: 25, tempRange: 14, peakSummerMonth: 6 },
  'sydney': { name: 'Sydney', country: 'Australia', lat: -33.86, lon: 151.20, baseTempC: 18, tempRange: 7, peakSummerMonth: 1 },
  'toronto': { name: 'Toronto', country: 'Canada', lat: 43.65, lon: -79.38, baseTempC: 9, tempRange: 16, peakSummerMonth: 7 },
  'berlin': { name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.40, baseTempC: 10, tempRange: 11, peakSummerMonth: 7 },
  'cairo': { name: 'Cairo', country: 'Egypt', lat: 30.04, lon: 31.23, baseTempC: 22, tempRange: 10, peakSummerMonth: 7 },
  'singapore': { name: 'Singapore', country: 'Singapore', lat: 1.35, lon: 103.81, baseTempC: 27, tempRange: 2, peakSummerMonth: 5 },
  'dubai': { name: 'Dubai', country: 'United Arab Emirates', lat: 25.20, lon: 55.27, baseTempC: 28, tempRange: 12, peakSummerMonth: 8 },
  'rome': { name: 'Rome', country: 'Italy', lat: 41.90, lon: 12.49, baseTempC: 16, tempRange: 10, peakSummerMonth: 7 },
  'madrid': { name: 'Madrid', country: 'Spain', lat: 40.41, lon: -3.70, baseTempC: 15, tempRange: 13, peakSummerMonth: 7 },
  'los angeles': { name: 'Los Angeles', country: 'United States', lat: 34.05, lon: -118.24, baseTempC: 19, tempRange: 6, peakSummerMonth: 8 },
  'chicago': { name: 'Chicago', country: 'United States', lat: 41.87, lon: -87.62, baseTempC: 10, tempRange: 16, peakSummerMonth: 7 },
  'san francisco': { name: 'San Francisco', country: 'United States', lat: 37.77, lon: -122.41, baseTempC: 14, tempRange: 4, peakSummerMonth: 9 },
  'são paulo': { name: 'São Paulo', country: 'Brazil', lat: -23.55, lon: -46.63, baseTempC: 20, tempRange: 5, peakSummerMonth: 2 },
  'beijing': { name: 'Beijing', country: 'China', lat: 39.90, lon: 116.40, baseTempC: 12, tempRange: 16, peakSummerMonth: 7 },
  'seoul': { name: 'Seoul', country: 'South Korea', lat: 37.56, lon: 126.97, baseTempC: 12, tempRange: 15, peakSummerMonth: 8 },
};

export function getHistoricalWeather(birthDateStr: string, cityName: string): HistoricalWeather {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  const normalizedCity = cityName.toLowerCase().trim();

  let climate: CityClimate = CITY_DATABASE[normalizedCity];
  if (!climate) {
    // Find closest match or create graceful procedural climate
    const matchedKey = Object.keys(CITY_DATABASE).find(k => normalizedCity.includes(k) || k.includes(normalizedCity));
    if (matchedKey) {
      climate = CITY_DATABASE[matchedKey];
    } else {
      climate = {
        name: cityName || 'Global City',
        country: 'Earth',
        lat: 35.0,
        lon: 0.0,
        baseTempC: 16,
        tempRange: 10,
        peakSummerMonth: 7,
      };
    }
  }

  // Calculate day of year
  const birthDate = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((birthDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Temperature formula based on latitude and seasonal cycle
  const monthAngle = ((month - climate.peakSummerMonth) / 12) * 2 * Math.PI;
  const seasonalDelta = Math.cos(monthAngle) * climate.tempRange;
  
  // Deterministic daily jitter using day of year
  const jitter = Math.sin(dayOfYear * 1.7 + year) * 3.2;
  let tempC = Math.round((climate.baseTempC + seasonalDelta + jitter) * 10) / 10;
  let tempF = Math.round(((tempC * 9) / 5 + 32) * 10) / 10;

  // Weather Condition
  let condition = 'Sunny & Clear';
  let conditionCode: HistoricalWeather['conditionCode'] = 'sunny';
  const weatherSeed = Math.abs(Math.sin(dayOfYear * 3.1 + year * 0.7));

  if (tempC < 1) {
    if (weatherSeed > 0.4) {
      condition = 'Snow Showers & Crisp Air';
      conditionCode = 'snow';
    } else {
      condition = 'Freezing Clear Sky';
      conditionCode = 'clear_night';
    }
  } else if (weatherSeed > 0.75) {
    condition = 'Passing Gentle Rain & Misty';
    conditionCode = 'rain';
  } else if (weatherSeed > 0.45) {
    condition = 'Partly Cloudy with Golden Breaks';
    conditionCode = 'partly_cloudy';
  } else if (weatherSeed > 0.25) {
    condition = 'Overcast & Soft Starlight';
    conditionCode = 'cloudy';
  } else {
    condition = 'Bright Sunshine & Blue Skies';
    conditionCode = 'sunny';
  }

  // Humidity & Wind
  const humidity = Math.min(95, Math.max(30, Math.round(55 + Math.cos(dayOfYear) * 20 + weatherSeed * 15)));
  const windSpeedKmh = Math.round(10 + Math.abs(Math.sin(dayOfYear * 2.3)) * 18);

  // Sunrise / Sunset calculation
  const { sunrise, sunset, dayLength } = calculateSunTimes(dayOfYear, climate.lat);

  // Seasonal note
  let seasonNote = 'A gentle day with clear celestial visibility.';
  if (conditionCode === 'rain') seasonNote = 'Soft rain blessed the earth with refreshing calm.';
  if (conditionCode === 'snow') seasonNote = 'A blanket of crisp winter snow adorned the skyline.';
  if (conditionCode === 'sunny') seasonNote = 'Sunlit skies and calm breezes greeted your entrance into the world.';

  return {
    tempC,
    tempF,
    condition,
    conditionCode,
    humidity,
    windSpeedKmh,
    sunrise,
    sunset,
    dayLength,
    seasonNote,
    isReconstructed: true,
  };
}

function calculateSunTimes(dayOfYear: number, lat: number) {
  // Approximate solar declination
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);
  const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
  
  const latRad = (lat * Math.PI) / 180;
  let cosHourAngle = -Math.tan(latRad) * Math.tan(declination);
  cosHourAngle = Math.max(-1, Math.min(1, cosHourAngle));
  
  const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);
  const dayDurationHours = (hourAngle * 2) / 15;

  const solarNoon = 12.0;
  const sunriseDecimal = solarNoon - dayDurationHours / 2;
  const sunsetDecimal = solarNoon + dayDurationHours / 2;

  const formatTime = (decHours: number) => {
    let h = Math.floor(decHours);
    let m = Math.floor((decHours - h) * 60);
    if (h < 0) h += 24;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? '0' + m : m;
    return `${displayH}:${displayM} ${period}`;
  };

  const hoursLength = Math.floor(dayDurationHours);
  const minsLength = Math.round((dayDurationHours - hoursLength) * 60);

  return {
    sunrise: formatTime(sunriseDecimal),
    sunset: formatTime(sunsetDecimal),
    dayLength: `${hoursLength}h ${minsLength}m`,
  };
}
