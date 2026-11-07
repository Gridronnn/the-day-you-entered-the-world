import { TimelineItemPayload } from '../types/story';

interface LandmarkEvent {
  year: number;
  title: string;
  category: 'Global Milestone' | 'Technology' | 'Space & Science' | 'Culture' | 'Humanity';
  description: string;
  source_name: string;
  source_url: string;
}

const HISTORICAL_LANDMARKS: LandmarkEvent[] = [
  {
    year: 1969,
    title: 'Apollo 11 Lands on the Moon',
    category: 'Space & Science',
    description: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the lunar surface, watched live by 650 million people.',
    source_name: 'NASA History Division',
    source_url: 'https://www.nasa.gov/mission_pages/apollo/apollo-11.html',
  },
  {
    year: 1974,
    title: 'Birth of the Universal Product Code (UPC)',
    category: 'Technology',
    description: 'The first grocery barcode scan takes place in Troy, Ohio, revolutionizing global logistics and retail commerce.',
    source_name: 'Smithsonian National Museum of American History',
    source_url: 'https://americanhistory.si.edu/',
  },
  {
    year: 1977,
    title: 'Voyager Space Probes Launched',
    category: 'Space & Science',
    description: 'NASA launches Voyager 1 and 2 carrying the Golden Record to explore the outer solar system and interstellar space.',
    source_name: 'NASA Jet Propulsion Laboratory',
    source_url: 'https://voyager.jpl.nasa.gov/',
  },
  {
    year: 1982,
    title: 'Time Magazine Names the Computer "Machine of the Year"',
    category: 'Technology',
    description: 'The personal computer enters homes worldwide, accelerating the digital revolution.',
    source_name: 'Time Archive',
    source_url: 'https://time.com/vault/year/1982/',
  },
  {
    year: 1989,
    title: 'Fall of the Berlin Wall & Invention of the World Wide Web',
    category: 'Global Milestone',
    description: 'The Berlin Wall opens, symbolizing the end of the Cold War, while Tim Berners-Lee authors the World Wide Web proposal.',
    source_name: 'CERN & United Nations Archives',
    source_url: 'https://home.cern/science/computing/birth-web',
  },
  {
    year: 1990,
    title: 'Hubble Space Telescope Deployed',
    category: 'Space & Science',
    description: 'The Space Shuttle Discovery places the Hubble Space Telescope into orbit, transforming our view of the cosmos.',
    source_name: 'Space Telescope Science Institute',
    source_url: 'https://hubblesite.org/',
  },
  {
    year: 1995,
    title: 'Launch of the Commercial Internet & Java Platform',
    category: 'Technology',
    description: 'The National Science Foundation privatizes the internet backbone, creating the modern interconnected world economy.',
    source_name: 'Internet History Society',
    source_url: 'https://www.internethalloffame.org/',
  },
  {
    year: 1998,
    title: 'International Space Station First Module Launched',
    category: 'Space & Science',
    description: 'Zarya, the first component of the International Space Station, is launched from Baikonur Cosmodrome.',
    source_name: 'NASA ISS Archive',
    source_url: 'https://www.nasa.gov/mission_pages/station/main/index.html',
  },
  {
    year: 2000,
    title: 'The New Millennium & Human Genome Working Draft',
    category: 'Humanity',
    description: 'The Human Genome Project announces the initial sequencing of the human genetic blueprint.',
    source_name: 'National Human Genome Research Institute',
    source_url: 'https://www.genome.gov/',
  },
  {
    year: 2004,
    title: 'Mars Exploration Rovers Spirit & Opportunity Touch Down',
    category: 'Space & Science',
    description: 'Twin rovers discover incontrovertible evidence of past liquid water on the Martian surface.',
    source_name: 'NASA JPL Mars Exploration',
    source_url: 'https://mars.nasa.gov/mer/',
  },
  {
    year: 2007,
    title: 'Dawn of the Modern Smartphone Era',
    category: 'Technology',
    description: 'Capacitive multi-touch smartphones merge mobile telephony, GPS navigation, and pocket computing.',
    source_name: 'Computer History Museum',
    source_url: 'https://computerhistory.org/',
  },
  {
    year: 2012,
    title: 'Discovery of the Higgs Boson Particle',
    category: 'Space & Science',
    description: 'Physicists at the Large Hadron Collider at CERN confirm the existence of the Higgs boson, completing the Standard Model.',
    source_name: 'CERN Press Office',
    source_url: 'https://home.cern/news/press-release/cern/cern-experiments-observe-particle-consistent-long-sought-higgs-boson',
  },
  {
    year: 2015,
    title: 'The Paris Climate Accord & Gravitational Waves Detected',
    category: 'Humanity',
    description: '196 nations sign the landmark Paris Agreement, while LIGO makes the first direct observation of gravitational ripples in spacetime.',
    source_name: 'UNFCCC & LIGO Caltech',
    source_url: 'https://unfccc.int/process-and-meetings/the-paris-agreement',
  },
  {
    year: 2020,
    title: 'Global mRNA Vaccine Breakthrough & Remote Work Shift',
    category: 'Humanity',
    description: 'Scientists design and deploy high-efficacy mRNA vaccines in record time, transforming molecular medicine.',
    source_name: 'World Health Organization',
    source_url: 'https://www.who.int/',
  },
  {
    year: 2022,
    title: 'James Webb Space Telescope First Deep Field & Artemis 1',
    category: 'Space & Science',
    description: 'JWST transmits the deepest infrared portraits of the early universe, and NASA Orion completes its circumlunar test.',
    source_name: 'NASA & ESA JWST Operations',
    source_url: 'https://webb.nasa.gov/',
  },
  {
    year: 2026,
    title: 'Planetary Scale: 8.2 Billion Humans & Generative Intelligence',
    category: 'Global Milestone',
    description: 'The world reaches 8.2 billion population while accelerated quantum computing and clean energy breakthroughs scale globally.',
    source_name: 'U.S. Census Bureau & International Energy Agency',
    source_url: 'https://www.census.gov/',
  },
];

export function generatePersonalTimeline(birthYear: number): TimelineItemPayload[] {
  const currentYear = 2026;
  const validBirthYear = Math.max(1930, Math.min(birthYear, currentYear));

  const items: TimelineItemPayload[] = [];

  // 1. Birth Year Anchor Entry
  items.push({
    year: validBirthYear,
    age: 0,
    title: 'Your Arrival Year (' + validBirthYear + ')',
    category: 'Global Milestone',
    description: 'Your personal journey begins! The foundation for your lifetime is set against the backdrop of world events in ' + validBirthYear + '.',
    source_name: 'Historical Archive Registry',
    source_url: 'https://en.wikipedia.org/wiki/' + validBirthYear,
    confidence: 'Exact Birth Year',
  });

  // 2. Find intermediate landmark events that occurred after the birth year and up to current year
  const relevantLandmarks = HISTORICAL_LANDMARKS.filter(
    (l) => l.year > validBirthYear && l.year < currentYear
  );

  for (const landmark of relevantLandmarks) {
    items.push({
      year: landmark.year,
      age: landmark.year - validBirthYear,
      title: landmark.title,
      category: landmark.category,
      description: landmark.description,
      source_name: landmark.source_name,
      source_url: landmark.source_url,
      confidence: 'Verified Historic Record',
    });
  }

  // 3. Current Year (2026) Anchor Entry
  if (validBirthYear < currentYear) {
    const currentAge = currentYear - validBirthYear;
    items.push({
      year: currentYear,
      age: currentAge,
      title: 'Today (2026) • Age ' + currentAge,
      category: 'Global Milestone',
      description: 'At ' + currentAge + ' years of age, your lifetime has witnessed unprecedented transformation across human history, technology, and space exploration.',
      source_name: 'Current Global Demographic Registry',
      source_url: 'https://the-day-you-entered-the-world.vercel.app',
      confidence: 'Live 2026 Benchmark',
    });
  }

  return items;
}
