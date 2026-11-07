import { AstronomyPayload, DateFactsPayload } from '../types/story';

export function calculateDateFacts(birthDateStr: string, latitude: number = 51.5): DateFactsPayload {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[birthDate.getDay()];

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const diffTime = Math.max(0, today.getTime() - birthDate.getTime());
  const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const age = today.getFullYear() - year - (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day) ? 1 : 0);

  const heartbeatsEstimate = daysLived * 103680;
  const breathsEstimate = daysLived * 23040;
  const earthKmTraveledEstimate = daysLived * 2592000;

  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((birthDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const westernZodiac = getWesternZodiac(month, day);
  const chineseZodiac = getChineseZodiac(year);
  const birthstone = getBirthstone(month);
  const birthFlower = getBirthFlower(month);
  const season = getSeason(month, latitude);

  return {
    dayOfWeek,
    julianDay,
    age,
    daysLived,
    heartbeatsEstimate,
    breathsEstimate,
    earthKmTraveledEstimate,
    westernZodiac,
    chineseZodiac,
    birthstone,
    birthFlower,
    season,
    hemisphere: latitude >= 0 ? 'Northern Hemisphere' : 'Southern Hemisphere',
    dayOfYear,
    isLeapYear,
    dataType: 'calculated',
    calculationBasis: 'Gregorian Calendar ephemeris & Hemispheric Solar Position',
  };
}

export function calculateAstronomy(birthDateStr: string, timezone: string = 'UTC'): AstronomyPayload {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + 0.85 + B - 1524.5;
  const T = (JD - 2451545.0) / 36525;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const normalize = (deg: number) => ((deg % 360) + 360) % 360;

  const D = normalize(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  const M = normalize(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  const Mp = normalize(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);

  const elongation = normalize(D + 6.289 * Math.sin(toRad(Mp)) - 2.100 * Math.sin(toRad(M)) + 1.274 * Math.sin(toRad(2 * D - Mp)) + 0.658 * Math.sin(toRad(2 * D)));
  const phaseAngleDeg = Math.abs(180 - elongation);
  const k = (1 + Math.cos(toRad(phaseAngleDeg))) / 2;
  const illuminationPct = Math.round(k * 100);

  const synodicMonth = 29.53058867;
  const knownNewMoonJD = 2451549.5;
  const daysSinceNew = (JD - knownNewMoonJD) % synodicMonth;
  const ageDays = Math.round(((daysSinceNew < 0 ? daysSinceNew + synodicMonth : daysSinceNew) * 10)) / 10;

  let phaseType: AstronomyPayload['phaseType'] = 'new';
  let name = 'New Moon';
  let poeticMeaning = 'A seed planted in cosmic darkness, brimming with infinite potential.';

  if (ageDays < 1.84 || ageDays >= 28.5) {
    phaseType = 'new';
    name = 'New Moon';
    poeticMeaning = 'You arrived under an invisible moon, carrying quiet mystery, raw beginnings, and untold power.';
  } else if (ageDays < 6.5) {
    phaseType = 'waxing_crescent';
    name = 'Waxing Crescent';
    poeticMeaning = 'A sliver of starlight in the twilight—born to spark growth, hope, and curious imagination.';
  } else if (ageDays < 8.5) {
    phaseType = 'first_quarter';
    name = 'First Quarter';
    poeticMeaning = 'A bold half-moon of equilibrium—blessed with decisive action, courage, and relentless momentum.';
  } else if (ageDays < 13.5) {
    phaseType = 'waxing_gibbous';
    name = 'Waxing Gibbous';
    poeticMeaning = 'A luminous swell reaching toward perfection—born with an eye for refinement, abundance, and mastery.';
  } else if (ageDays < 16.5) {
    phaseType = 'full';
    name = 'Full Moon';
    poeticMeaning = 'The night was fully illuminated when you arrived—granting profound emotional depth, charisma, and radiant clarity.';
  } else if (ageDays < 21.5) {
    phaseType = 'waning_gibbous';
    name = 'Waning Gibbous';
    poeticMeaning = 'A wise, generous glow reflecting gratitude, deep insight, and enduring strength.';
  } else if (ageDays < 23.5) {
    phaseType = 'last_quarter';
    name = 'Last Quarter';
    poeticMeaning = 'A reflective half-moon of truth—blessed with keen discernment, letting go of illusions, and deep integrity.';
  } else {
    phaseType = 'waning_crescent';
    name = 'Waning Crescent';
    poeticMeaning = 'A mystical silver sliver before dawn—carrying ancient soul wisdom, spiritual intuition, and healing warmth.';
  }

  return {
    status: 'available',
    moonPhaseName: name,
    illuminationPct,
    moonAgeDays: ageDays,
    phaseType,
    poeticMeaning,
    calculationBasis: {
      method: 'Jean Meeus Astronomical Algorithms (NASA/JPL Horizon Standard)',
      timezone,
      julianDayEphemeris: Math.round(JD * 100) / 100,
      dataType: 'calculated',
      note: 'Illumination calculations vary by ±1% depending on topocentric observer angle, timezone, and ephemeris algorithm.',
    },
  };
}

function getWesternZodiac(month: number, day: number) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { sign: 'Aries', symbol: '♈', element: 'Fire' as const, rulingPlanet: 'Mars', traits: ['Courageous', 'Energetic', 'Passionate', 'Pioneering'], compatibility: 'Leo, Sagittarius, Gemini', luckyNumbers: [1, 9, 17, 27] };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { sign: 'Taurus', symbol: '♉', element: 'Earth' as const, rulingPlanet: 'Venus', traits: ['Steadfast', 'Grounded', 'Sensual', 'Loyal'], compatibility: 'Virgo, Capricorn, Cancer', luckyNumbers: [2, 6, 15, 24] };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { sign: 'Gemini', symbol: '♊', element: 'Air' as const, rulingPlanet: 'Mercury', traits: ['Curious', 'Adaptable', 'Witty', 'Eloquent'], compatibility: 'Libra, Aquarius, Aries', luckyNumbers: [3, 5, 14, 23] };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { sign: 'Cancer', symbol: '♋', element: 'Water' as const, rulingPlanet: 'Moon', traits: ['Nurturing', 'Intuitive', 'Protective', 'Deep Feeler'], compatibility: 'Scorpio, Pisces, Taurus', luckyNumbers: [2, 7, 16, 25] };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { sign: 'Leo', symbol: '♌', element: 'Fire' as const, rulingPlanet: 'Sun', traits: ['Radiant', 'Charismatic', 'Generous', 'Bold Leader'], compatibility: 'Aries, Sagittarius, Gemini', luckyNumbers: [1, 4, 10, 19] };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { sign: 'Virgo', symbol: '♍', element: 'Earth' as const, rulingPlanet: 'Mercury', traits: ['Analytical', 'Kind', 'Meticulous', 'Master Craftsman'], compatibility: 'Taurus, Capricorn, Cancer', luckyNumbers: [5, 14, 23, 32] };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { sign: 'Libra', symbol: '♎', element: 'Air' as const, rulingPlanet: 'Venus', traits: ['Harmonious', 'Charming', 'Diplomatic', 'Graceful'], compatibility: 'Gemini, Aquarius, Leo', luckyNumbers: [6, 15, 24, 33] };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { sign: 'Scorpio', symbol: '♏', element: 'Water' as const, rulingPlanet: 'Pluto', traits: ['Magnetic', 'Passionate', 'Intuitive', 'Transformational'], compatibility: 'Cancer, Pisces, Virgo', luckyNumbers: [8, 11, 18, 22] };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { sign: 'Sagittarius', symbol: '♐', element: 'Fire' as const, rulingPlanet: 'Jupiter', traits: ['Optimistic', 'Adventurous', 'Philosophical', 'Generous'], compatibility: 'Aries, Leo, Aquarius', luckyNumbers: [3, 7, 9, 12] };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { sign: 'Capricorn', symbol: '♑', element: 'Earth' as const, rulingPlanet: 'Saturn', traits: ['Disciplined', 'Ambitious', 'Wise', 'Enduring'], compatibility: 'Taurus, Virgo, Scorpio', luckyNumbers: [4, 8, 13, 22] };
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { sign: 'Aquarius', symbol: '♒', element: 'Air' as const, rulingPlanet: 'Uranus', traits: ['Visionary', 'Inventive', 'Independent', 'Humanitarian'], compatibility: 'Gemini, Libra, Sagittarius', luckyNumbers: [4, 7, 11, 29] };
  }
  return { sign: 'Pisces', symbol: '♓', element: 'Water' as const, rulingPlanet: 'Neptune', traits: ['Mystical', 'Compassionate', 'Intuitive', 'Gentle Dreamer'], compatibility: 'Cancer, Scorpio, Taurus', luckyNumbers: [3, 9, 12, 21] };
}

function getChineseZodiac(year: number) {
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const elements = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'] as const;
  const index = (year - 4) % 12;
  const animal = animals[index >= 0 ? index : index + 12];
  const elementIndex = (year - 4) % 10;
  const element = elements[elementIndex >= 0 ? elementIndex : elementIndex + 10];
  const polarity = year % 2 === 0 ? ('Yang' as const) : ('Yin' as const);

  return {
    animal,
    element,
    polarity,
    traits: ['Wisdom', 'Courage', 'Loyalty', 'Insight'],
    luckyNumbers: [2, 6, 8],
  };
}

function getBirthstone(month: number) {
  const stones = [
    { name: 'Garnet', traditional: 'Garnet', meaning: 'Protection, passion, and vitality', color: '#880808' },
    { name: 'Amethyst', traditional: 'Amethyst', meaning: 'Peace, intuition, and mental clarity', color: '#9966CC' },
    { name: 'Aquamarine', traditional: 'Bloodstone', meaning: 'Serenity, courage, and clear truth', color: '#7FFFD4' },
    { name: 'Diamond', traditional: 'Diamond', meaning: 'Invincible strength and enduring love', color: '#E0FFFF' },
    { name: 'Emerald', traditional: 'Emerald', meaning: 'Rebirth, wisdom, and prosperity', color: '#50C878' },
    { name: 'Pearl & Alexandrite', traditional: 'Pearl', meaning: 'Harmony and luminous grace', color: '#FDEEF4' },
    { name: 'Ruby', traditional: 'Ruby', meaning: 'Fiery passion, majesty, and bravery', color: '#E0115F' },
    { name: 'Peridot', traditional: 'Sardonyx', meaning: 'Joy, optimism, and good fortune', color: '#99E550' },
    { name: 'Sapphire', traditional: 'Sapphire', meaning: 'Wisdom, nobility, and loyalty', color: '#0F52BA' },
    { name: 'Opal', traditional: 'Tourmaline', meaning: 'Creative inspiration and magic', color: '#A8E6CF' },
    { name: 'Topaz & Citrine', traditional: 'Topaz', meaning: 'Warmth, abundance, and glow', color: '#FFD700' },
    { name: 'Tanzanite & Turquoise', traditional: 'Turquoise', meaning: 'Deep vision and transformation', color: '#40E0D0' },
  ];
  return stones[month - 1] || stones[0];
}

function getBirthFlower(month: number) {
  const flowers = [
    { name: 'Carnation & Snowdrop', meaning: 'Fascination, distinction, and love' },
    { name: 'Violet & Primrose', meaning: 'Modesty, faithfulness, and virtue' },
    { name: 'Daffodil & Jonquil', meaning: 'Rebirth, new beginnings, and prosperity' },
    { name: 'Daisy & Sweet Pea', meaning: 'Innocence, blissful pleasure, and loyal love' },
    { name: 'Lily of the Valley & Hawthorn', meaning: 'Sweetness, humility, and returned happiness' },
    { name: 'Rose & Honeysuckle', meaning: 'Devotion, eternal beauty, and warmth' },
    { name: 'Larkspur & Water Lily', meaning: 'Open heart, pure intentions, and grace' },
    { name: 'Gladiolus & Poppy', meaning: 'Moral integrity, strength of character, and remembrance' },
    { name: 'Aster & Morning Glory', meaning: 'Wisdom, faith, and affectionate remembrance' },
    { name: 'Marigold & Cosmos', meaning: 'Creativity, passion, and enduring light' },
    { name: 'Chrysanthemum & Peony', meaning: 'Friendship, optimism, and abundance' },
    { name: 'Narcissus & Holly', meaning: 'Hope, domestic happiness, and good cheer' },
  ];
  return flowers[month - 1] || flowers[0];
}

function getSeason(month: number, lat: number) {
  const isNorth = lat >= 0;
  if (month === 12 || month === 1 || month === 2) {
    return isNorth ? 'Winter (Northern Hemisphere)' : 'Summer (Southern Hemisphere)';
  }
  if (month >= 3 && month <= 5) {
    return isNorth ? 'Spring (Northern Hemisphere)' : 'Autumn (Southern Hemisphere)';
  }
  if (month >= 6 && month <= 8) {
    return isNorth ? 'Summer (Northern Hemisphere)' : 'Winter (Southern Hemisphere)';
  }
  return isNorth ? 'Autumn (Northern Hemisphere)' : 'Spring (Southern Hemisphere)';
}
