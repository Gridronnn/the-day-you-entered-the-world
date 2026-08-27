import { ZodiacInfo, DayFacts } from '../types/history';

export function calculateDayFacts(birthDateStr: string): DayFacts {
  const [year, month, day] = birthDateStr.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  // Day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[birthDate.getDay()];

  // Julian Day
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Days lived
  const diffTime = Math.max(0, today.getTime() - birthDate.getTime());
  const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Heartbeats (~72 bpm = 103,680/day) & Breaths (~16 bpm = 23,040/day)
  const heartbeats = daysLived * 103680;
  const breaths = daysLived * 23040;

  // Day of year
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((birthDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const leapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return {
    dayOfWeek,
    daysLived,
    heartbeats,
    breaths,
    julianDay,
    dayOfYear,
    leapYear,
  };
}

export function calculateZodiacInfo(birthDateStr: string, city: string = ''): ZodiacInfo {
  const [year, month, day] = birthDateStr.split('-').map(Number);

  // 1. Western Zodiac
  const western = getWesternZodiac(month, day);

  // 2. Chinese Zodiac
  const chinese = getChineseZodiac(year);

  // 3. Moon Phase
  const moonPhase = calculateMoonPhase(year, month, day);

  // 4. Birthstone
  const birthstone = getBirthstone(month);

  // 5. Birth Flower
  const birthFlower = getBirthFlower(month);

  // 6. Season
  const season = getSeason(month, day, city);

  return {
    western,
    chinese,
    moonPhase,
    birthstone,
    birthFlower,
    season,
  };
}

function getWesternZodiac(month: number, day: number) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      sign: 'Aries',
      symbol: '♈',
      element: 'Fire' as const,
      rulingPlanet: 'Mars',
      traits: ['Courageous', 'Passionate', 'Pioneering', 'Energetic', 'Bold Leader'],
      compatibility: 'Leo, Sagittarius, Gemini',
      luckyNumbers: [1, 9, 18, 27],
    };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      sign: 'Taurus',
      symbol: '♉',
      element: 'Earth' as const,
      rulingPlanet: 'Venus',
      traits: ['Reliable', 'Patient', 'Sensual', 'Devoted', 'Grounded'],
      compatibility: 'Virgo, Capricorn, Cancer',
      luckyNumbers: [2, 6, 15, 24],
    };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      sign: 'Gemini',
      symbol: '♊',
      element: 'Air' as const,
      rulingPlanet: 'Mercury',
      traits: ['Curious', 'Adaptable', 'Witty', 'Eloquent', 'Quick-Minded'],
      compatibility: 'Libra, Aquarius, Aries',
      luckyNumbers: [3, 5, 14, 23],
    };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      sign: 'Cancer',
      symbol: '♋',
      element: 'Water' as const,
      rulingPlanet: 'Moon',
      traits: ['Intuitive', 'Empathetic', 'Protective', 'Imaginative', 'Loyal'],
      compatibility: 'Scorpio, Pisces, Taurus',
      luckyNumbers: [2, 7, 11, 20],
    };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      sign: 'Leo',
      symbol: '♌',
      element: 'Fire' as const,
      rulingPlanet: 'Sun',
      traits: ['Generous', 'Charismatic', 'Warmhearted', 'Radiant', 'Inspiring'],
      compatibility: 'Aries, Sagittarius, Gemini',
      luckyNumbers: [1, 4, 10, 19],
    };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      sign: 'Virgo',
      symbol: '♍',
      element: 'Earth' as const,
      rulingPlanet: 'Mercury',
      traits: ['Analytical', 'Meticulous', 'Kind', 'Practical', 'Master Problem Solver'],
      compatibility: 'Taurus, Capricorn, Cancer',
      luckyNumbers: [5, 14, 23, 32],
    };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      sign: 'Libra',
      symbol: '♎',
      element: 'Air' as const,
      rulingPlanet: 'Venus',
      traits: ['Harmonious', 'Diplomatic', 'Artistic', 'Charming', 'Peace Lover'],
      compatibility: 'Gemini, Aquarius, Leo',
      luckyNumbers: [6, 15, 24, 33],
    };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      sign: 'Scorpio',
      symbol: '♏',
      element: 'Water' as const,
      rulingPlanet: 'Pluto & Mars',
      traits: ['Passionate', 'Deep', 'Resourceful', 'Magnetic', 'Transformative'],
      compatibility: 'Cancer, Pisces, Virgo',
      luckyNumbers: [8, 11, 18, 22],
    };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      sign: 'Sagittarius',
      symbol: '♐',
      element: 'Fire' as const,
      rulingPlanet: 'Jupiter',
      traits: ['Optimistic', 'Adventurous', 'Philosophical', 'Generous', 'Truth Seeker'],
      compatibility: 'Aries, Leo, Aquarius',
      luckyNumbers: [3, 7, 9, 12],
    };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return {
      sign: 'Capricorn',
      symbol: '♑',
      element: 'Earth' as const,
      rulingPlanet: 'Saturn',
      traits: ['Ambitious', 'Disciplined', 'Wise', 'Steadfast', 'Enduring Visionary'],
      compatibility: 'Taurus, Virgo, Scorpio',
      luckyNumbers: [4, 8, 13, 22],
    };
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      sign: 'Aquarius',
      symbol: '♒',
      element: 'Air' as const,
      rulingPlanet: 'Uranus',
      traits: ['Visionary', 'Independent', 'Original', 'Humanitarian', 'Inventive'],
      compatibility: 'Gemini, Libra, Sagittarius',
      luckyNumbers: [4, 7, 11, 29],
    };
  }
  return {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water' as const,
    rulingPlanet: 'Neptune',
    traits: ['Compassionate', 'Mystical', 'Artistic', 'Intuitive', 'Gentle Dreamer'],
    compatibility: 'Cancer, Scorpio, Taurus',
    luckyNumbers: [3, 9, 12, 21],
  };
}

function getChineseZodiac(year: number) {
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const elements: ('Metal' | 'Water' | 'Wood' | 'Fire' | 'Earth')[] = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
  
  // Chinese zodiac cycle base 1900 = Rat, Metal
  const animalIndex = (year - 4) % 12;
  const animal = animals[animalIndex >= 0 ? animalIndex : animalIndex + 12];
  
  const elementIndex = (year - 4) % 10;
  const element = elements[elementIndex >= 0 ? elementIndex : elementIndex + 10];
  
  const polarity: 'Yang' | 'Yin' = year % 2 === 0 ? 'Yang' : 'Yin';

  const traitsMap: Record<string, string[]> = {
    Rat: ['Clever', 'Quick-witted', 'Resourceful', 'Charming'],
    Ox: ['Determined', 'Honest', 'Reliable', 'Strong-willed'],
    Tiger: ['Brave', 'Confident', 'Charismatic', 'Dynamic'],
    Rabbit: ['Gentle', 'Elegant', 'Empathetic', 'Wise'],
    Dragon: ['Majestic', 'Ambitious', 'Visionary', 'Magnetic'],
    Snake: ['Intelligent', 'Mysterious', 'Wise', 'Graceful'],
    Horse: ['Free-spirited', 'Energetic', 'Independent', 'Warm'],
    Goat: ['Artistic', 'Kind', 'Calm', 'Imaginative'],
    Monkey: ['Brilliant', 'Playful', 'Inventive', 'Versatile'],
    Rooster: ['Observant', 'Hardworking', 'Courageous', 'Punctual'],
    Dog: ['Loyal', 'Truehearted', 'Protective', 'Sincere'],
    Pig: ['Generous', 'Compassionate', 'Joyful', 'Noble'],
  };

  return {
    animal,
    element,
    polarity,
    traits: traitsMap[animal] || ['Wise', 'Loyal', 'Noble'],
    luckyNumbers: [(year % 9) + 1, ((year * 3) % 9) + 1, 8],
  };
}

function calculateMoonPhase(year: number, month: number, day: number) {
  // Known new moon reference: Jan 6, 2000 at 18:14 UTC
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const diffDays = (targetDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  const synodicMonth = 29.53058867;
  
  let phaseDays = diffDays % synodicMonth;
  if (phaseDays < 0) phaseDays += synodicMonth;

  const illuminationPct = Math.round(((1 - Math.cos((phaseDays / synodicMonth) * 2 * Math.PI)) / 2) * 100);

  let phaseType: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent' = 'new';
  let name = 'New Moon';
  let poeticMeaning = 'A seed planted in cosmic darkness, brimming with infinite potential.';

  if (phaseDays < 1.84) {
    phaseType = 'new';
    name = 'New Moon';
    poeticMeaning = 'You arrived under an invisible moon, carrying quiet mystery, raw beginnings, and untold power.';
  } else if (phaseDays < 5.53) {
    phaseType = 'waxing_crescent';
    name = 'Waxing Crescent';
    poeticMeaning = 'A sliver of starlight in the twilight—born to spark growth, hope, and curious imagination.';
  } else if (phaseDays < 9.22) {
    phaseType = 'first_quarter';
    name = 'First Quarter';
    poeticMeaning = 'A bold half-moon of equilibrium—blessed with decisive action, courage, and relentless momentum.';
  } else if (phaseDays < 12.91) {
    phaseType = 'waxing_gibbous';
    name = 'Waxing Gibbous';
    poeticMeaning = 'A luminous swell reaching toward perfection—born with an eye for refinement, abundance, and mastery.';
  } else if (phaseDays < 16.61) {
    phaseType = 'full';
    name = 'Full Moon';
    poeticMeaning = 'The night was fully illuminated when you arrived—granting profound emotional depth, charisma, and radiant clarity.';
  } else if (phaseDays < 20.30) {
    phaseType = 'waning_gibbous';
    name = 'Waning Gibbous (Disseminating)';
    poeticMeaning = 'A golden harvest moon—born to teach, share boundless wisdom, and enrich everyone around you.';
  } else if (phaseDays < 23.99) {
    phaseType = 'last_quarter';
    name = 'Last Quarter';
    poeticMeaning = 'A reflective half-moon of truth—blessed with keen discernment, letting go of illusions, and deep integrity.';
  } else {
    phaseType = 'waning_crescent';
    name = 'Waning Crescent (Balsamic)';
    poeticMeaning = 'A mystical silver sliver before dawn—carrying ancient soul wisdom, spiritual intuition, and healing warmth.';
  }

  return {
    name,
    ageDays: Math.round(phaseDays * 10) / 10,
    illuminationPct,
    phaseType,
    poeticMeaning,
  };
}

function getBirthstone(month: number) {
  const stones = [
    { modern: 'Garnet', traditional: 'Garnet', color: '#880808', meaning: 'Protection, passion, and vitality' },
    { modern: 'Amethyst', traditional: 'Amethyst', color: '#9966CC', meaning: 'Peace, intuition, and mental clarity' },
    { modern: 'Aquamarine', traditional: 'Bloodstone', color: '#7FFFD4', meaning: 'Serenity, courage, and clear truth' },
    { modern: 'Diamond', traditional: 'Diamond', color: '#E0FFFF', meaning: 'Invincible strength, purity, and enduring love' },
    { modern: 'Emerald', traditional: 'Emerald', color: '#50C878', meaning: 'Rebirth, wisdom, and boundless prosperity' },
    { modern: 'Alexandrite & Pearl', traditional: 'Pearl', color: '#FDEEF4', meaning: 'Harmony, imagination, and luminous grace' },
    { modern: 'Ruby', traditional: 'Ruby', color: '#E0115F', meaning: 'Fiery passion, royal majesty, and bravery' },
    { modern: 'Peridot & Spinel', traditional: 'Sardonyx', color: '#99E550', meaning: 'Joy, radiant optimism, and good fortune' },
    { modern: 'Sapphire', traditional: 'Sapphire', color: '#0F52BA', meaning: 'Wisdom, nobility, and profound loyalty' },
    { modern: 'Opal & Tourmaline', traditional: 'Opal', color: '#A8E6CF', meaning: 'Creative inspiration, magic, and hope' },
    { modern: 'Topaz & Citrine', traditional: 'Topaz', color: '#FFD700', meaning: 'Warmth, generosity, and abundance' },
    { modern: 'Tanzanite & Turquoise', traditional: 'Turquoise', color: '#40E0D0', meaning: 'Deep vision, transformation, and victory' },
  ];
  return stones[month - 1] || stones[0];
}

function getBirthFlower(month: number) {
  const flowers = [
    { name: 'Carnation & Snowdrop', symbolism: 'Fierce devotion, pure love, and winter resilience' },
    { name: 'Violet & Primrose', symbolism: 'Modesty, faithfulness, and tender innocence' },
    { name: 'Daffodil & Jonquil', symbolism: 'New beginnings, golden sunshine, and joyful rebirth' },
    { name: 'Daisy & Sweet Pea', symbolism: 'Playful spirit, cheerful loyalty, and bliss' },
    { name: 'Lily of the Valley & Hawthorn', symbolism: 'Return of sweetness, peace, and guardianship' },
    { name: 'Rose & Honeysuckle', symbolism: 'Timeless love, beauty, and devoted bonds' },
    { name: 'Larkspur & Water Lily', symbolism: 'Lighthearted joy, open heart, and nobility' },
    { name: 'Gladiolus & Poppy', symbolism: 'Strength of character, remembrance, and honor' },
    { name: 'Aster & Morning Glory', symbolism: 'Celestial elegance, faith, and patience' },
    { name: 'Marigold & Cosmos', symbolism: 'Golden optimism, creative flame, and balance' },
    { name: 'Chrysanthemum', symbolism: 'Long life, happiness, and heartfelt optimism' },
    { name: 'Narcissus & Holly', symbolism: 'Warm hope, celebration, and inner brilliance' },
  ];
  return flowers[month - 1] || flowers[0];
}

function getSeason(month: number, day: number, city: string): string {
  const southernCities = ['sydney', 'melbourne', 'auckland', 'cape town', 'buenos aires', 'santiago', 'são paulo', 'rio de janeiro', 'johannesburg', 'perth', 'brisbane'];
  const isSouthern = southernCities.some(c => city.toLowerCase().includes(c));

  let season = 'Spring';
  if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day < 21)) {
    season = isSouthern ? 'Autumn' : 'Spring';
  } else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 23)) {
    season = isSouthern ? 'Winter' : 'Summer';
  } else if ((month === 9 && day >= 23) || month === 10 || month === 11 || (month === 12 && day < 21)) {
    season = isSouthern ? 'Spring' : 'Autumn';
  } else {
    season = isSouthern ? 'Summer' : 'Winter';
  }

  return season;
}
