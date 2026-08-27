import {
  WorldNewsItem,
  CityNewsItem,
  HistoricalEvent,
  FamousBirthday,
  PopCulture,
  UpliftingEvent,
  ThenVsNowMetric,
  DayDataPayload,
  UserBirthInput,
} from '../types/history';
import { calculateDayFacts, calculateZodiacInfo } from './astronomyEngine';
import { getHistoricalWeather } from './weatherEngine';
import { calculateCostOfLiving } from './currencyEngine';

interface YearEraArchive {
  worldHeadlines: WorldNewsItem[];
  events: HistoricalEvent[];
  song: PopCulture['billboardSong'];
  movie: PopCulture['boxOfficeMovie'];
  tvShows: string[];
  fashionTrends: string[];
  toysGames: string[];
  slang: { term: string; meaning: string }[];
  uplifting: UpliftingEvent[];
  thenVsNow: ThenVsNowMetric[];
  notableDeaths: { name: string; role: string; year: number; legacy: string }[];
  sportsMilestone: { title: string; champion: string; detail: string };
  classicBook: { title: string; author: string; impact: string };
}

const ERA_ARCHIVES: Record<string, YearEraArchive> = {
  '1950s': {
    worldHeadlines: [
      { id: '50-1', title: 'Dawn of the Space Age & First Satellite Beacons', category: 'Science', description: 'Scientists and dreamers turned eyes to the stars as cosmic telemetry began.', source: 'International Herald', impactTag: 'Cosmic Dawn' },
      { id: '50-2', title: 'Polio Vaccine Miracle Announced by Jonas Salk', category: 'World', description: 'Mass medical triumph brought global hope and saved millions of children.', source: 'Global Medical Times', impactTag: 'Medical Breakthrough' },
      { id: '50-3', title: 'Rock and Roll Electrifies Youth Culture Worldwide', category: 'Culture', description: 'New vibrant rhythm shook radio waves and forever transformed dance floors.', source: 'Radio Echoes', impactTag: 'Cultural Revolution' },
    ],
    events: [
      { year: 1953, date: 'May 29', title: 'Summit of Mount Everest Conquered', description: 'Edmund Hillary and Tenzing Norgay stood on top of the world.', category: 'Discovery', badge: '🏔️ Peak Wonder' },
      { year: 1954, date: 'May 6', title: 'Four-Minute Mile Barrier Broken', description: 'Roger Bannister proved the human spirit could shatter perceived limits.', category: 'Sports', badge: '⚡ Human Limit' },
      { year: 1958, date: 'Jul 29', title: 'NASA Formed to Reach the Cosmos', description: 'President Eisenhower signed the National Aeronautics and Space Act.', category: 'Science', badge: '🚀 Space Frontier' },
    ],
    song: {
      title: 'Rock Around the Clock',
      artist: 'Billie Holiday & Bill Haley',
      weeksAtNo1: 8,
      genre: 'Early Rock & Jukebox Rhythm',
      lyricsSnippet: "One, two, three o'clock, four o'clock, rock! We're gonna rock around the clock tonight!",
      melodyNotes: [
        { freq: 261.63, duration: 0.3 }, { freq: 329.63, duration: 0.3 }, { freq: 392.00, duration: 0.3 }, { freq: 523.25, duration: 0.6 },
      ],
    },
    movie: {
      title: 'Singin\' in the Rain & Roman Holiday',
      director: 'Stanley Donen / William Wyler',
      worldwideGross: '$12.5 Million',
      genre: 'Romantic Musical & Classic Comedy',
      quote: "What a glorious feeling, I'm happy again!",
      tagline: 'The Technicolor marvel that danced into everyone’s hearts.',
    },
    tvShows: ['I Love Lucy', 'The Twilight Zone', 'The Ed Sullivan Show', 'Leave It to Beaver'],
    fashionTrends: ['Poodle skirts', 'Leather biker jackets', 'Slicked pompadours', 'Cat-eye glasses', 'Cardigan twinsets'],
    toysGames: ['Hula Hoop craze', 'Mr. Potato Head', 'Matchbox cars', 'Slinky', 'Original Barbie doll'],
    slang: [
      { term: 'Made in the shade', meaning: 'In a great, effortless position.' },
      { term: 'Cool cat', meaning: 'A remarkably stylish and relaxed person.' },
      { term: 'Ankle biter', meaning: 'Affectionate nickname for a toddler.' },
    ],
    uplifting: [
      { title: 'Global Eradication of Childhood Diseases Launched', category: 'Medical', description: 'Mass international vaccination coalitions united across borders.', badge: '🩺 Health Victory' },
      { title: 'Universal Declaration of Human Rights Spread', category: 'Humanitarian', description: 'Schools worldwide began teaching fundamental dignity for all humans.', badge: '🕊️ Peace & Dignity' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '2.7 Billion', nowValue: '8.1 Billion', changeDescription: 'Global community tripled', category: 'Demographics', tag: '3x Growth' },
      { title: 'Life Expectancy', thenValue: '48.5 Years', nowValue: '73.4 Years', changeDescription: '+25 years gained worldwide', category: 'Health', tag: '+51% Longer' },
      { title: 'Gold Price (oz)', thenValue: '$35', nowValue: '$2,550+', changeDescription: 'Monetary standard evolution', category: 'Economy', tag: 'Store of Value' },
      { title: 'Global Cinema Ticket', thenValue: '$0.50', nowValue: '$14.50', changeDescription: 'Classic theater popcorn era', category: 'Culture', tag: 'Silver Screen' },
    ],
    sportsMilestone: { title: '1958 FIFA World Cup & Pelé Wonder', champion: 'Brazil (17-year-old Pelé scores 6 goals)', detail: 'Pelé captivated the planet as Brazil won their first World Cup title.' },
    classicBook: { title: 'The Lord of the Rings & The Catcher in the Rye', author: 'J.R.R. Tolkien / J.D. Salinger', impact: 'Redefined fantasy mythology and modern youth literature.' },
    notableDeaths: [
      { name: 'Albert Einstein', role: 'Theoretical Physicist', year: 1955, legacy: 'Transformed humanity\'s understanding of space, time, and gravity.' },
      { name: 'Frida Kahlo', role: 'Master Surrealist Painter', year: 1954, legacy: 'Immortalized vibrant Mexican art and unbreakable human spirit.' },
    ],
  },
  '1960s': {
    worldHeadlines: [
      { id: '60-1', title: 'Humanity Lands on the Moon: Apollo 11 Giant Leap', category: 'Science', description: 'Neil Armstrong and Buzz Aldrin walked the lunar dust as half a billion watched.', source: 'World News Dispatch', impactTag: 'Cosmic Milestone' },
      { id: '60-2', title: 'The Beatles & The British Invasion Take the Planet', category: 'Culture', description: 'Unprecedented global harmonies united young hearts across oceans.', source: 'Melody Maker', impactTag: 'Music Revolution' },
      { id: '60-3', title: 'Civil Rights Movement Sparks Historic March on Washington', category: 'World', description: 'Dr. Martin Luther King Jr. delivered his timeless "I Have a Dream" address.', source: 'Capital Press', impactTag: 'Freedom & Justice' },
    ],
    events: [
      { year: 1969, date: 'Jul 20', title: 'Apollo 11 Lands on the Moon', description: '"That\'s one small step for man, one giant leap for mankind."', category: 'Discovery', badge: '🌕 Moonwalk' },
      { year: 1964, date: 'Oct 14', title: 'Martin Luther King Jr. Wins Nobel Peace Prize', description: 'Honored for championing nonviolent civil equality.', category: 'History', badge: '🕊️ Nobel Laureate' },
      { year: 1969, date: 'Aug 15', title: 'Woodstock Festival Celebrates Peace & Music', description: '400,000 peaceful souls gathered in Bethel, New York.', category: 'Arts', badge: '🎸 Peace & Harmony' },
    ],
    song: {
      title: 'Hey Jude',
      artist: 'The Beatles',
      weeksAtNo1: 9,
      genre: 'British Pop & Timeless Anthem',
      lyricsSnippet: 'Take a sad song and make it better. Remember to let her into your heart...',
      melodyNotes: [
        { freq: 349.23, duration: 0.4 }, { freq: 293.66, duration: 0.4 }, { freq: 329.63, duration: 0.4 }, { freq: 349.23, duration: 0.6 },
        { freq: 392.00, duration: 0.4 }, { freq: 261.63, duration: 0.6 },
      ],
    },
    movie: {
      title: '2001: A Space Odyssey & The Sound of Music',
      director: 'Stanley Kubrick / Robert Wise',
      worldwideGross: '$163 Million',
      genre: 'Sci-Fi Vision & Cinematic Grandeur',
      quote: "The hills are alive with the sound of music!",
      tagline: 'Cinema expanded into the cosmos and majestic mountains.',
    },
    tvShows: ['Star Trek (Original Series)', 'The Flintstones', 'Doctor Who', 'The Andy Griffith Show'],
    fashionTrends: ['Bell-bottoms', 'Tie-dye shirts', 'Miniskirts by Mary Quant', 'Go-go boots', 'Peace sign medallions'],
    toysGames: ['Etch A Sketch', 'Easy-Bake Oven', 'G.I. Joe', 'Twister game', 'Super Ball'],
    slang: [
      { term: 'Groovy', meaning: 'Extremely pleasant, fashionable, or enjoyable.' },
      { term: 'Far out', meaning: 'Incredible, profound, and unconventional.' },
      { term: 'Can you dig it?', meaning: 'Do you understand and appreciate this?' },
    ],
    uplifting: [
      { title: 'First Global Earth Day Inspires Environmental Protection', category: 'Environment', description: '20 million citizens took to the streets to protect our living planet.', badge: '🌍 Earth Guardian' },
      { title: 'First Successful Human Heart Transplant', category: 'Medical', description: 'Pioneering surgical miracle expanded the horizon of life-saving medicine.', badge: '❤️ Heart of Hope' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '3.6 Billion', nowValue: '8.1 Billion', changeDescription: 'Global family doubled', category: 'Demographics', tag: '2.2x Growth' },
      { title: 'Life Expectancy', thenValue: '55.3 Years', nowValue: '73.4 Years', changeDescription: '+18 years added to life', category: 'Health', tag: '+33% Longer' },
      { title: 'Gold Price (oz)', thenValue: '$35', nowValue: '$2,550+', changeDescription: 'Gold standard transition', category: 'Economy', tag: '70x Value' },
      { title: 'Microprocessors', thenValue: '2,300 Transistors', nowValue: '100+ Billion', changeDescription: 'Birth of silicon computing', category: 'Tech', tag: 'Silicon Era' },
    ],
    sportsMilestone: { title: 'Muhammad Ali vs Sonny Liston & England 1966 World Cup', champion: 'Muhammad Ali & England National Team', detail: '"Float like a butterfly, sting like a bee!" as Ali crowned heavyweight king.' },
    classicBook: { title: 'To Kill a Mockingbird & Dune', author: 'Harper Lee / Frank Herbert', impact: 'Pulitzer Prize winner for racial justice and magnum opus sci-fi worldbuilding.' },
    notableDeaths: [
      { name: 'Winston Churchill', role: 'British Statesman & Nobel Laureate', year: 1965, legacy: 'Symbol of resilient democratic defense during WWII.' },
      { name: 'Marilyn Monroe', role: 'Hollywood Icon', year: 1962, legacy: 'Golden Age cinema legend whose charm captured the world.' },
    ],
  },
  '1970s': {
    worldHeadlines: [
      { id: '70-1', title: 'First Personal Microcomputer & Silicon Valley Spark', category: 'Tech', description: 'Inventors in garages built the foundation of personal computing.', source: 'Tech Review', impactTag: 'Digital Genesis' },
      { id: '70-2', title: 'Disco Phenomenon and Studio 54 Spark Worldwide Glow', category: 'Culture', description: 'Glittering mirror balls and basslines defined night culture everywhere.', source: 'Rolling Stone', impactTag: 'Disco Fever' },
      { id: '70-3', title: 'Voyager Probes Launched with Golden Records for the Stars', category: 'Science', description: 'Carrying earth sounds, greetings, and Bach to deep interstellar space.', source: 'Cosmic Gazette', impactTag: 'Message to Eternity' },
    ],
    events: [
      { year: 1977, date: 'May 25', title: 'Star Wars Debuts in Theaters', description: 'George Lucas transformed mythic storytelling and cinematic wonder.', category: 'Arts', badge: '🌌 Star Wars' },
      { year: 1971, date: 'Nov 15', title: 'Intel Releases First Microprocessor 4004', description: 'The single-chip CPU that sparked the computer revolution.', category: 'Science', badge: '💾 Microchip' },
      { year: 1976, date: 'Apr 1', title: 'Apple Computer Company Founded', description: 'Steve Jobs and Steve Wozniak started Apple in a Los Altos garage.', category: 'Tech', badge: '🍏 Apple Spark' },
    ],
    song: {
      title: 'Stayin\' Alive / Bohemian Rhapsody',
      artist: 'Bee Gees / Queen',
      weeksAtNo1: 8,
      genre: 'Disco Harmony & Rock Opera Masterpiece',
      lyricsSnippet: 'Whether you\'re a brother or whether you\'re a mother, you\'re stayin\' alive!',
      melodyNotes: [
        { freq: 349.23, duration: 0.3 }, { freq: 392.00, duration: 0.3 }, { freq: 440.00, duration: 0.4 }, { freq: 349.23, duration: 0.4 },
      ],
    },
    movie: {
      title: 'Star Wars: A New Hope & Jaws',
      director: 'George Lucas / Steven Spielberg',
      worldwideGross: '$775 Million',
      genre: 'Space Fantasy & Cinematic Blockbuster',
      quote: "May the Force be with you.",
      tagline: 'A long time ago in a galaxy far, far away...',
    },
    tvShows: ['M*A*S*H', 'Happy Days', 'Saturday Night Live', 'Charlie\'s Angels', 'The Muppet Show'],
    fashionTrends: ['Platform shoes', 'Satin disco shirts', 'Flared jeans', 'Afros & feather cuts', 'Corduroy jackets'],
    toysGames: ['Rubik\'s Cube invention', 'Atari 2600 console', 'Pet Rock', 'Connect Four', 'Simon electronic memory'],
    slang: [
      { term: 'Catch you on the flip side', meaning: 'See you next time or later on.' },
      { term: 'Right on!', meaning: 'An energetic exclamation of agreement.' },
      { term: 'Keep on truckin\'', meaning: 'Keep persevering forward with a smile.' },
    ],
    uplifting: [
      { title: 'Smallpox Officially Declared Eradicated from Earth', category: 'Medical', description: 'WHO announced the total wipeout of a disease that plagued humanity for millennia.', badge: '🌟 Historic Cure' },
      { title: 'Clean Water and Clean Air Acts Championed Globally', category: 'Environment', description: 'Landmark environmental legislation began restoring global rivers and skies.', badge: '💧 Clean Skies' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '4.4 Billion', nowValue: '8.1 Billion', changeDescription: 'Global growth of +3.7B people', category: 'Demographics', tag: '+84% More' },
      { title: 'Average Gasoline', thenValue: '$0.55 / gal', nowValue: '$3.65 / gal', changeDescription: 'Pre-electronic fuel era', category: 'Economy', tag: 'Analog Roads' },
      { title: 'Storage Capacity', thenValue: '1.44 MB Floppy', nowValue: '1,000,000 MB Phone', changeDescription: 'Million-fold data explosion', category: 'Tech', tag: 'Million-Fold' },
      { title: 'Average Home Price', thenValue: '$35,000', nowValue: '$425,000', changeDescription: 'Real estate baseline', category: 'Economy', tag: 'Generational' },
    ],
    sportsMilestone: { title: 'Rumble in the Jungle (1974) & Montreal Olympics Nadia Comăneci', champion: 'Muhammad Ali & Nadia Comăneci (First Perfect 10)', detail: 'Ali defeated Foreman in Kinshasa; Nadia scored the first Olympic gymnastics perfect 10.0.' },
    classicBook: { title: 'The Shining & The Hitchhiker\'s Guide to the Galaxy', author: 'Stephen King / Douglas Adams', impact: 'Pioneered gripping psychological horror and philosophical British comic sci-fi.' },
    notableDeaths: [
      { name: 'Elvis Presley', role: 'The King of Rock and Roll', year: 1977, legacy: 'Electrified global youth culture and forever changed popular music.' },
      { name: 'Charlie Chaplin', role: 'Silent Film Pioneer & Genius', year: 1977, legacy: 'Brought laughter and profound humanitarian empathy to world cinema.' },
    ],
  },
  '1980s': {
    worldHeadlines: [
      { id: '80-1', title: 'The Fall of the Berlin Wall: Freedom Unites Nations', category: 'World', description: 'Citizens danced atop the wall with hammers in a triumph of human unity.', source: 'Global Courier', impactTag: 'Historic Freedom' },
      { id: '80-2', title: 'Live Aid Concert Broadcasts to 1.9 Billion People', category: 'Culture', description: 'Artists united the entire globe in the largest humanitarian broadcast ever.', source: 'World Sound Post', impactTag: 'Humanitarian Wave' },
      { id: '80-3', title: 'Personal Computers & Sony Walkman Enter Everyday Life', category: 'Tech', description: 'Music became private and portable; glowing monitors entered homes.', source: 'Silicon Herald', impactTag: 'Tech Revolution' },
    ],
    events: [
      { year: 1989, date: 'Nov 9', title: 'The Berlin Wall Opens', description: 'Divided families reunited as borders melted into history.', category: 'History', badge: '🧱 Freedom Wall' },
      { year: 1982, date: 'Nov 30', title: 'Michael Jackson Releases Thriller', description: 'Became the best-selling studio album in the history of music.', category: 'Arts', badge: '🕺 Thriller King' },
      { year: 1984, date: 'Jan 24', title: 'Apple Macintosh Introduced', description: 'Steve Jobs unveiled the computer that introduced the GUI and mouse.', category: 'Tech', badge: '🖥️ Hello Mac' },
    ],
    song: {
      title: 'Billie Jean / Every Breath You Take',
      artist: 'Michael Jackson / The Police',
      weeksAtNo1: 8,
      genre: 'Electrifying Pop Funk & Synth Wave',
      lyricsSnippet: 'Billie Jean is not my lover, she\'s just a girl who claims that I am the one...',
      melodyNotes: [
        { freq: 370.00, duration: 0.3 }, { freq: 277.18, duration: 0.3 }, { freq: 293.66, duration: 0.3 }, { freq: 329.63, duration: 0.4 },
        { freq: 293.66, duration: 0.3 }, { freq: 277.18, duration: 0.3 }, { freq: 246.94, duration: 0.5 },
      ],
    },
    movie: {
      title: 'Back to the Future & E.T. the Extra-Terrestrial',
      director: 'Robert Zemeckis / Steven Spielberg',
      worldwideGross: '$792 Million',
      genre: 'Time Travel Adventure & Heartwarming Sci-Fi',
      quote: "Where we're going, we don't need roads!",
      tagline: '1.21 Gigawatts of pure cinematic joy and nostalgia.',
    },
    tvShows: ['Miami Vice', 'The Golden Girls', 'Knight Rider', 'The A-Team', 'Cheers'],
    fashionTrends: ['Neon windbreakers', 'Shoulder pads', 'Acid-wash denim', 'Leg warmers & headbands', 'Members Only jackets'],
    toysGames: ['Nintendo Entertainment System (NES)', 'Game Boy (Tetris)', 'Cabbage Patch Kids', 'Transformers', 'Care Bears'],
    slang: [
      { term: 'Radical! / Rad', meaning: 'Exceptionally cool, exciting, and awesome.' },
      { term: 'Like, totally!', meaning: 'Expressing complete, enthusiastic agreement.' },
      { term: 'No way, José!', meaning: 'Playful refusal or expressing disbelief.' },
    ],
    uplifting: [
      { title: 'Montreal Protocol Signed to Heal the Ozone Layer', category: 'Environment', description: 'Every nation agreed to ban CFCs, successfully repairing the sky\'s protective shield.', badge: '🛡️ Ozone Victory' },
      { title: 'Live Aid Raised $127M for Global Famine Relief', category: 'Humanitarian', description: 'Music brought world superpowers together for humanitarian love.', badge: '🤝 Universal Bond' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '4.8 Billion', nowValue: '8.1 Billion', changeDescription: '+3.3 Billion people added', category: 'Demographics', tag: '+68% More' },
      { title: 'Internet Users', thenValue: '< 100,000 Scientists', nowValue: '5.4 Billion People', changeDescription: 'Connected humanity', category: 'Connectivity', tag: 'Global Web' },
      { title: 'Computer Memory (RAM)', thenValue: '64 Kilobytes (0.06 MB)', nowValue: '16,000,000 KB (16 GB)', changeDescription: '250,000x multiplier in memory', category: 'Tech', tag: '250,000x' },
      { title: 'Gold Price (oz)', thenValue: '$380', nowValue: '$2,550+', changeDescription: 'Inflation and value appreciation', category: 'Economy', tag: '6.7x Multiplier' },
    ],
    sportsMilestone: { title: '1986 World Cup Diego Maradona & Miracle on Ice', champion: 'Argentina & 1980 US Olympic Hockey Team', detail: 'Maradona scored the "Goal of the Century" against England in Mexico City.' },
    classicBook: { title: 'Neuromancer & The Alchemist', author: 'William Gibson / Paulo Coelho', impact: 'Coined the concept of cyberspace and sold over 150 million inspirational copies.' },
    notableDeaths: [
      { name: 'John Lennon', role: 'Singer & Peace Champion', year: 1980, legacy: 'Voiced universal peace anthems with Imagine and The Beatles.' },
      { name: 'Bob Marley', role: 'Reggae Legend & Messenger of Unity', year: 1981, legacy: 'Spread message of love, emancipation, and positive vibrations globally.' },
    ],
  },
  '1990s': {
    worldHeadlines: [
      { id: '90-1', title: 'Birth of the World Wide Web: The Digital Era Begins', category: 'Tech', description: 'Tim Berners-Lee opened the web protocol to the world for free.', source: 'Wired Dispatch', impactTag: 'Connected Planet' },
      { id: '90-2', title: 'Nelson Mandela Freed & Democratic Dawn in South Africa', category: 'World', description: 'After 27 years, Mandela walked into freedom with forgiveness and reconciliation.', source: 'International Post', impactTag: 'Triumph of Hope' },
      { id: '90-3', title: 'Hubble Space Telescope Opens the Deepest View of the Universe', category: 'Science', description: 'Breathtaking photographs of star nurseries and ancient galaxies arrived.', source: 'Space Gazette', impactTag: 'Cosmic Vision' },
    ],
    events: [
      { year: 1994, date: 'May 10', title: 'Nelson Mandela Inaugurated as President', description: 'A monumental victory for human equality and peaceful transition.', category: 'History', badge: '🇿🇦 Mandela Rainbow' },
      { year: 1990, date: 'Apr 24', title: 'Hubble Space Telescope Deployed', description: 'Peered into deep time to reveal the majestic tapestry of galaxies.', category: 'Science', badge: '🔭 Hubble Eye' },
      { year: 1997, date: 'Jun 26', title: 'Harry Potter and the Philosopher\'s Stone Published', description: 'J.K. Rowling rekindled the world\'s love of reading magic.', category: 'Arts', badge: '⚡ Wizarding Dawn' },
    ],
    song: {
      title: 'Wannabe / Smells Like Teen Spirit / I Want It That Way',
      artist: 'Spice Girls / Nirvana / Backstreet Boys',
      weeksAtNo1: 7,
      genre: 'Pop Phenomenon & Grunge Revolution',
      lyricsSnippet: 'Tell me why! Ain\'t nothin\' but a heartache. Tell me why! Ain\'t nothin\' but a mistake...',
      melodyNotes: [
        { freq: 440.00, duration: 0.3 }, { freq: 392.00, duration: 0.3 }, { freq: 349.23, duration: 0.4 }, { freq: 440.00, duration: 0.4 },
        { freq: 523.25, duration: 0.6 },
      ],
    },
    movie: {
      title: 'Titanic & Jurassic Park & The Matrix',
      director: 'James Cameron / Steven Spielberg / The Wachowskis',
      worldwideGross: '$2.2 Billion',
      genre: 'Epic Romance, Sci-Fi Marvel & Cyber Action',
      quote: "I'm the king of the world!",
      tagline: 'The era when computer CGI brought dinosaurs and dreams to life.',
    },
    tvShows: ['Friends', 'The X-Files', 'The Fresh Prince of Bel-Air', 'Seinfeld', 'ER', 'Buffy the Vampire Slayer'],
    fashionTrends: ['Baggy flannel shirts', 'Chunky platform sneakers', 'Bucket hats', 'Butterfly clips', 'Overalls with one strap down'],
    toysGames: ['Nintendo 64 (Super Mario 64)', 'Original Pokémon Red/Blue', 'Tamagotchi virtual pets', 'Beanie Babies', 'Furby'],
    slang: [
      { term: 'All that and a bag of chips', meaning: 'Unquestionably the best and most impressive.' },
      { term: 'As if!', meaning: 'Exclamation of total skepticism (popularized by Clueless).' },
      { term: 'Da bomb!', meaning: 'Something extraordinary, amazing, or wonderful.' },
    ],
    uplifting: [
      { title: 'Human Genome Project Maps the Blueprint of Life', category: 'Medical', description: 'International scientists decoded human DNA and made all genetic findings freely public.', badge: '🧬 DNA Blueprint' },
      { title: 'Good Friday Agreement Brings Lasting Peace to Northern Ireland', category: 'Humanitarian', description: 'Historic diplomacy replaced decades of conflict with shared governance.', badge: '🕊️ Peace Accord' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '5.7 Billion', nowValue: '8.1 Billion', changeDescription: '+2.4 Billion people', category: 'Demographics', tag: '+42% More' },
      { title: 'Internet Speed', thenValue: '56 Kbps Dial-Up', nowValue: '1,000,000 Kbps Fiber', changeDescription: '18,000x faster downloads', category: 'Speed', tag: 'Instant Speed' },
      { title: 'Movie Theater Ticket', thenValue: '$4.25', nowValue: '$14.50', changeDescription: 'Cinema inflation benchmark', category: 'Culture', tag: 'Cinema Gold' },
      { title: 'Mobile Phone Weight', thenValue: '500g Brick Phone', nowValue: '180g Ultra Glass', changeDescription: 'From radio brick to supercomputer', category: 'Tech', tag: 'Pocket Supercomputer' },
    ],
    sportsMilestone: { title: 'Chicago Bulls 6x NBA Championships & 1998 World Cup', champion: 'Michael Jordan\'s Chicago Bulls & France', detail: 'Michael Jordan dominated global sports, inspiring billions of athletes.' },
    classicBook: { title: 'Harry Potter and the Philosopher\'s Stone & The Golden Compass', author: 'J.K. Rowling / Philip Pullman', impact: 'Ignited a worldwide renaissance of young reading and fantasy cinema.' },
    notableDeaths: [
      { name: 'Princess Diana & Mother Teresa', role: 'Global Humanitarians', year: 1997, legacy: 'Touched millions through tireless charitable work and deep compassion.' },
      { name: 'Carl Sagan', role: 'Astronomer & Science Communicator', year: 1996, legacy: 'Inspired humanity to look up at the cosmos with humility and awe.' },
    ],
  },
  '2000s': {
    worldHeadlines: [
      { id: '00-1', title: 'Dawn of the New Millennium: Worldwide Midnight Fireworks', category: 'World', description: 'Time zones celebrated together across London, Sydney, Paris, and Tokyo.', source: 'Millennium Times', impactTag: 'New Century' },
      { id: '00-2', title: 'The Smartphone Era Arrives: Steve Jobs Unveils iPhone', category: 'Tech', description: 'Music, internet, and phone merged into a single pocket glass touch device.', source: 'Tech Chronology', impactTag: 'Smartphone Leap' },
      { id: '00-3', title: 'International Space Station Permanently Crewed in Orbit', category: 'Science', description: 'Astronauts from diverse nations have lived continuously in orbit ever since.', source: 'Cosmic Observer', impactTag: 'Orbital Home' },
    ],
    events: [
      { year: 2007, date: 'Jan 9', title: 'Steve Jobs Introduces the iPhone', description: '"Today, Apple is going to reinvent the phone."', category: 'Tech', badge: '📱 iPhone Dawn' },
      { year: 2004, date: 'Feb 4', title: 'Facebook and the Social Web Emerge', description: 'Connecting college dorms and soon billions across the globe.', category: 'Culture', badge: '🌐 Social Era' },
      { year: 2008, date: 'Aug 8', title: 'Beijing Olympics & Usain Bolt World Records', description: 'Usain Bolt ran 9.69s with untied shoelaces, redefining human speed.', category: 'Sports', badge: '⚡ Lightning Bolt' },
    ],
    song: {
      title: 'Crazy in Love / Umbrella / Hey Ya!',
      artist: 'Beyoncé / Rihanna / Outkast',
      weeksAtNo1: 10,
      genre: 'Modern R&B, Pop Powerhouse & Hip-Hop',
      lyricsSnippet: 'You got me looking so crazy right now, your love\'s got me looking so crazy right now!',
      melodyNotes: [
        { freq: 440.00, duration: 0.25 }, { freq: 440.00, duration: 0.25 }, { freq: 523.25, duration: 0.4 }, { freq: 493.88, duration: 0.4 },
        { freq: 440.00, duration: 0.6 },
      ],
    },
    movie: {
      title: 'The Lord of the Rings: Return of the King & The Dark Knight & Avatar',
      director: 'Peter Jackson / Christopher Nolan / James Cameron',
      worldwideGross: '$2.9 Billion',
      genre: 'Epic Fantasy Masterpiece, Superhero Noir & 3D Sci-Fi',
      quote: "Why so serious?",
      tagline: 'Won 11 Academy Awards and redefined visual cinema for generations.',
    },
    tvShows: ['The Office', 'Lost', 'Breaking Bad', 'The Sopranos', 'Avatar: The Last Airbender'],
    fashionTrends: ['Low-rise jeans', 'Velour tracksuits', 'Trucker hats', 'Chunky digital watches', 'Layered polos'],
    toysGames: ['PlayStation 2 & Wii Sports', 'Nintendo DS', 'Bionicle Lego', 'Xbox 360 Halo', 'iPod classic with click wheel'],
    slang: [
      { term: 'That\'s hot', meaning: 'Extremely stylish, desirable, and cool.' },
      { term: 'Bling-bling', meaning: 'Eye-catching, shimmering jewelry and luxury.' },
      { term: 'Peace out', meaning: 'A calm, friendly way of saying goodbye.' },
    ],
    uplifting: [
      { title: 'Global Poverty Rates Cut in Half (UN Millennium Goals)', category: 'Humanitarian', description: 'Over one billion people lifted out of extreme poverty through worldwide action.', badge: '📈 Global Progress' },
      { title: 'Solar and Wind Energy Costs Plummeted by 80%', category: 'Environment', description: 'Clean renewable power became cheaper than fossil fuels for the first time.', badge: '☀️ Solar Power' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '6.5 Billion', nowValue: '8.1 Billion', changeDescription: '+1.6 Billion people', category: 'Demographics', tag: '+24% More' },
      { title: 'Smartphone Users', thenValue: '< 50 Million', nowValue: '4.9 Billion People', changeDescription: 'From novelty to universal companion', category: 'Adoption', tag: '100x Growth' },
      { title: 'Gold Price (oz)', thenValue: '$400', nowValue: '$2,550+', changeDescription: '6x increase in value', category: 'Economy', tag: '6x Multiplier' },
      { title: 'Streaming Media', thenValue: 'DVD Mail Envelopes', nowValue: 'Instant 4K Cloud', changeDescription: 'Physical discs to on-demand instant access', category: 'Culture', tag: '4K Streaming' },
    ],
    sportsMilestone: { title: 'Usain Bolt Triple Gold & 2002 Brazil World Cup Champions', champion: 'Usain Bolt (9.69s world record) & Brazil (Ronaldo 8 goals)', detail: 'Bolt electrified Beijing, smiling across the finish line with untied shoelaces.' },
    classicBook: { title: 'The Da Vinci Code & The Kite Runner', author: 'Dan Brown / Khaled Hosseini', impact: 'Sensational bestselling mysteries and poignant stories of friendship and redemption.' },
    notableDeaths: [
      { name: 'Michael Jackson', role: 'The King of Pop', year: 2009, legacy: 'Revolutionized musical performance, music video cinema, and pop dancing.' },
      { name: 'Pope John Paul II', role: 'Global Pontiff & Peacemaker', year: 2005, legacy: 'Champion of human freedom and global ecumenical dialogue.' },
    ],
  },
  '2010s': {
    worldHeadlines: [
      { id: '10-1', title: 'Higgs Boson Particle Discovered at CERN', category: 'Science', description: 'Physicists confirmed the origin of mass in the cosmos with the Large Hadron Collider.', source: 'Physics World', impactTag: 'God Particle' },
      { id: '10-2', title: 'First Direct Image of a Black Hole Captured (M87*)', category: 'Science', description: 'Event Horizon Telescope linked eight observatories to photograph the event horizon.', source: 'Astrophysical Journal', impactTag: 'Cosmic Miracle' },
      { id: '10-3', title: 'Paris Climate Accord Signed by 195 Nations', category: 'World', description: 'Universal consensus to protect the climate for future generations.', source: 'United Nations Dispatch', impactTag: 'Planet Unity' },
    ],
    events: [
      { year: 2019, date: 'Apr 10', title: 'First Image of a Black Hole', description: 'The glowing orange silhouette of M87* gave humanity sight into the abyss.', category: 'Discovery', badge: '🕳️ Black Hole Sight' },
      { year: 2015, date: 'Jul 14', title: 'New Horizons Flies Past Pluto', description: 'Revealed a heart-shaped nitrogen glacier on the icy dwarf planet.', category: 'Science', badge: '🪐 Pluto Heart' },
      { year: 2016, date: 'Feb 11', title: 'Gravitational Waves Detected (LIGO)', description: 'Einstein\'s 100-year-old prediction of spacetime ripples proven real.', category: 'Discovery', badge: '🌊 Spacetime Ripple' },
    ],
    song: {
      title: 'Uptown Funk / Rolling in the Deep / Shape of You',
      artist: 'Mark Ronson ft. Bruno Mars / Adele / Ed Sheeran',
      weeksAtNo1: 14,
      genre: 'Modern Funk, Soul Anthem & Pop Sensation',
      lyricsSnippet: 'Don\'t believe me just watch! Uptown funk you up, uptown funk you up!',
      melodyNotes: [
        { freq: 293.66, duration: 0.2 }, { freq: 293.66, duration: 0.2 }, { freq: 329.63, duration: 0.2 }, { freq: 293.66, duration: 0.3 },
        { freq: 392.00, duration: 0.5 },
      ],
    },
    movie: {
      title: 'Avengers: Endgame & Frozen & Interstellar',
      director: 'Russo Brothers / Jennifer Lee / Christopher Nolan',
      worldwideGross: '$2.8 Billion',
      genre: 'Superhero Climax, Animation Magic & Deep Space Odyssey',
      quote: "I love you 3,000.",
      tagline: 'A decade-long cinematic tapestry culminated in record box offices.',
    },
    tvShows: ['Stranger Things', 'Game of Thrones', 'Sherlock', 'The Mandalorian', 'Parks and Recreation'],
    fashionTrends: ['Athleisure & hoodies', 'Skinny jeans', 'White sneakers everywhere', 'Minimalist aesthetics', 'Oversized jackets'],
    toysGames: ['Minecraft', 'Nintendo Switch (Zelda: Breath of the Wild)', 'Fortnite', 'Fidget Spinners', 'Funko Pops'],
    slang: [
      { term: 'Goat', meaning: 'Greatest Of All Time.' },
      { term: 'Lit', meaning: 'Exciting, vibrant, energetic, and amazing.' },
      { term: 'Vibe check', meaning: 'Assessing the emotional atmosphere and mood.' },
    ],
    uplifting: [
      { title: 'Global Literacy Reached Historic High of 87%', category: 'Humanitarian', description: 'More people can read and write today than at any point in human history.', badge: '📚 Knowledge Bloom' },
      { title: 'Wild Tiger and Giant Panda Populations Began Rebounding', category: 'Environment', description: 'Conservation parks helped endangered species exit the critical danger list.', badge: '🐼 Wildlife Revival' },
    ],
    thenVsNow: [
      { title: 'World Population', thenValue: '7.3 Billion', nowValue: '8.1 Billion', changeDescription: '+800 Million people', category: 'Demographics', tag: '+11% More' },
      { title: 'Electric Vehicles', thenValue: '< 500,000 Cars', nowValue: '40+ Million Worldwide', changeDescription: 'Zero-emission transportation revolution', category: 'Transport', tag: '80x Growth' },
      { title: 'James Webb Telescope', thenValue: 'In Construction', nowValue: 'Photographing First Stars', changeDescription: 'Peering back 13.5 billion years to cosmic dawn', category: 'Science', tag: 'First Light' },
      { title: 'AI Capabilities', thenValue: 'Simple Voice Assistants', nowValue: 'Generative Intelligence Models', changeDescription: 'The cognitive computing revolution', category: 'Tech', tag: 'Intelligence Leap' },
    ],
    sportsMilestone: { title: '2016 Leicester City Premier League & Cubs World Series', champion: 'Leicester City (5000-1 miracle) & Chicago Cubs (108-year drought ended)', detail: 'Unforgettable fairy tales that proved anything is possible in sports.' },
    classicBook: { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', impact: 'Phenomenal global bestseller exploring humanity\'s evolutionary journey.' },
    notableDeaths: [
      { name: 'Nelson Mandela & Stephen Hawking', role: 'Freedom Leader & Theoretical Physicist', year: 2013, legacy: 'Mandela unified a nation with forgiveness; Hawking unlocked the physics of time.' },
      { name: 'Steve Jobs', role: 'Visionary Apple Founder', year: 2011, legacy: 'Put a bicycle for the human mind into the pockets of billions.' },
    ],
  },
};

export function getEraArchive(year: number): YearEraArchive {
  if (year < 1960) return ERA_ARCHIVES['1950s'];
  if (year < 1970) return ERA_ARCHIVES['1960s'];
  if (year < 1980) return ERA_ARCHIVES['1970s'];
  if (year < 1990) return ERA_ARCHIVES['1980s'];
  if (year < 2000) return ERA_ARCHIVES['1990s'];
  if (year < 2010) return ERA_ARCHIVES['2000s'];
  return ERA_ARCHIVES['2010s'];
}

// Famous birthdays database by month and day
const FAMOUS_BIRTHDAYS: Record<string, FamousBirthday[]> = {
  '1-1': [{ name: 'J.D. Salinger', role: 'Author of The Catcher in the Rye', year: 1919, quote: 'What really knocks me out is a book that, when you\'re all done reading it, you wish the author was a terrific friend.', knownFor: 'Classic Literature', emoji: '📖' }],
  '1-15': [{ name: 'Martin Luther King Jr.', role: 'Civil Rights Champion & Nobel Laureate', year: 1929, quote: 'Darkness cannot drive out darkness; only light can do that.', knownFor: 'Champion of Human Dignity', emoji: '🕊️' }],
  '2-11': [{ name: 'Thomas Edison', role: 'Prolific Inventor & Electric Pioneer', year: 1847, quote: 'Genius is one percent inspiration and ninety-nine percent perspiration.', knownFor: 'Electric Light & Phonograph', emoji: '💡' }],
  '2-12': [{ name: 'Abraham Lincoln', role: '16th U.S. President', year: 1809, quote: 'Whatever you are, be a good one.', knownFor: 'Emancipation & Unity', emoji: '🎩' }],
  '2-24': [{ name: 'Steve Jobs', role: 'Visionary Co-founder of Apple', year: 1955, quote: 'The people who are crazy enough to think they can change the world are the ones who do.', knownFor: 'Digital Revolution', emoji: '🍏' }],
  '3-14': [{ name: 'Albert Einstein', role: 'Theoretical Physicist & Nobel Laureate', year: 1879, quote: 'Imagination is more important than knowledge.', knownFor: 'General Relativity & E=mc²', emoji: '🌌' }],
  '4-15': [{ name: 'Leonardo da Vinci', role: 'Renaissance Polymath & Painter', year: 1452, quote: 'Learning never exhausts the mind.', knownFor: 'Mona Lisa & Inventions', emoji: '🎨' }],
  '5-4': [{ name: 'Audrey Hepburn', role: 'Iconic Actress & UNICEF Goodwill Ambassador', year: 1929, quote: 'Nothing is impossible, the word itself says "I\'m possible!"', knownFor: 'Elegance & Philanthropy', emoji: '✨' }],
  '6-18': [{ name: 'Paul McCartney', role: 'Legendary Musician & Songwriter (The Beatles)', year: 1942, quote: 'And in the end, the love you take is equal to the love you make.', knownFor: 'Timeless Melodies', emoji: '🎸' }],
  '7-18': [{ name: 'Nelson Mandela', role: 'Anti-Apartheid Leader & President', year: 1918, quote: 'It always seems impossible until it\'s done.', knownFor: 'Courage & Reconciliation', emoji: '🇿🇦' }],
  '8-8': [{ name: 'Roger Federer', role: 'Tennis Champion & Sports Icon', year: 1981, quote: 'When you do something best in life, you don\'t really want to give that up.', knownFor: '20 Grand Slam Titles', emoji: '🎾' }],
  '8-29': [{ name: 'Michael Jackson', role: 'The King of Pop & Global Entertainer', year: 1958, quote: 'In a world filled with hate, we must still dare to hope.', knownFor: 'Thriller & Moonwalk', emoji: '🕺' }],
  '9-5': [{ name: 'Freddie Mercury', role: 'Queen Frontman & Rock Icon', year: 1946, quote: 'I won\'t be a rock star. I will be a legend.', knownFor: 'Bohemian Rhapsody', emoji: '👑' }],
  '10-28': [{ name: 'Bill Gates', role: 'Co-founder of Microsoft & Philanthropist', year: 1955, quote: 'As we look ahead into the next century, leaders will be those who empower others.', knownFor: 'Software & Global Health', emoji: '💻' }],
  '11-7': [{ name: 'Marie Curie', role: 'Double Nobel Laureate Physicist & Chemist', year: 1867, quote: 'Nothing in life is to be feared, it is only to be understood.', knownFor: 'Radioactivity Discovery', emoji: '🔬' }],
  '11-30': [{ name: 'Mark Twain', role: 'Author, Humorist & Father of American Literature', year: 1835, quote: 'The secret of getting ahead is getting started.', knownFor: 'Adventures of Huckleberry Finn', emoji: '✒️' }],
  '12-13': [{ name: 'Taylor Swift', role: 'Iconic Global Songwriter & Artist', year: 1989, quote: 'No matter what happens in life, be good to people. Being good to people is a wonderful legacy.', knownFor: 'Record-Breaking Music', emoji: '🎤' }],
  '12-25': [{ name: 'Sir Isaac Newton', role: 'Mathematician & Natural Philosopher', year: 1642, quote: 'If I have seen further, it is by standing on the shoulders of giants.', knownFor: 'Laws of Motion & Gravity', emoji: '🍎' }],
};

export function getFamousBirthdays(month: number, day: number, year: number): FamousBirthday[] {
  const key = `${month}-${day}`;
  if (FAMOUS_BIRTHDAYS[key]) {
    return FAMOUS_BIRTHDAYS[key];
  }
  
  // Return authentic curated figures who share the day spirit
  const monthLeaders: Record<number, FamousBirthday[]> = {
    1: [{ name: 'Benjamin Franklin', role: 'Founding Polymath & Scientist', year: 1706, quote: 'An investment in knowledge pays the best interest.', knownFor: 'Electricity & Wisdom', emoji: '⚡' }],
    2: [{ name: 'Galileo Galilei', role: 'Father of Modern Observational Astronomy', year: 1564, quote: 'All truths are easy to understand once they are discovered; the point is to discover them.', knownFor: 'Telescopic Astronomy', emoji: '🔭' }],
    3: [{ name: 'Vincent van Gogh', role: 'Post-Impressionist Master Painter', year: 1853, quote: 'I dream my painting and I paint my dream.', knownFor: 'The Starry Night', emoji: '🌻' }],
    4: [{ name: 'William Shakespeare', role: 'World\'s Greatest Dramatist & Poet', year: 1564, quote: 'All the world\'s a stage, and all the men and women merely players.', knownFor: 'Hamlet & Sonnets', emoji: '🎭' }],
    5: [{ name: 'Walt Whitman', role: 'Visionary American Poet', year: 1819, quote: 'Keep your face always toward the sunshine, and shadows will fall behind you.', knownFor: 'Leaves of Grass', emoji: '📜' }],
    6: [{ name: 'Helen Keller', role: 'Author, Disability Rights Advocate & Educator', year: 1880, quote: 'The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.', knownFor: 'Unbreakable Spirit', emoji: '🌟' }],
    7: [{ name: 'Frida Kahlo', role: 'Celebrated Mexican Artist & Cultural Icon', year: 1907, quote: 'Feet, what do I need you for when I have wings to fly?', knownFor: 'Vibrant Surreal Art', emoji: '🎨' }],
    8: [{ name: 'Neil Armstrong', role: 'Astronaut & First Human on the Moon', year: 1930, quote: 'Mystery creates wonder and wonder is the basis of man\'s desire to understand.', knownFor: 'Apollo 11 Commander', emoji: '🌕' }],
    9: [{ name: 'Leo Tolstoy', role: 'Master Novelist of War and Peace', year: 1828, quote: 'If you want to be happy, be.', knownFor: 'Epic World Literature', emoji: '📚' }],
    10: [{ name: 'John Lennon', role: 'Singer, Songwriter & Peace Champion', year: 1940, quote: 'You may say I\'m a dreamer, but I\'m not the only one.', knownFor: 'Imagine & The Beatles', emoji: '🕊️' }],
    11: [{ name: 'Carl Sagan', role: 'Astronomer, Planetary Scientist & Author', year: 1934, quote: 'We are made of star-stuff. We are a way for the cosmos to know itself.', knownFor: 'Cosmos & Pale Blue Dot', emoji: '✨' }],
    12: [{ name: 'Jane Austen', role: 'Beloved English Novelist', year: 1775, quote: 'There is no charm equal to tenderness of heart.', knownFor: 'Pride and Prejudice', emoji: '💌' }],
  };

  return monthLeaders[month] || [
    { name: 'Leonardo da Vinci', role: 'Renaissance Master & Visionary', year: 1452, quote: 'Learning never exhausts the mind.', knownFor: 'Infinite Curiosity', emoji: '🎨' }
  ];
}

export function getCityNewsItem(city: string, year: number): CityNewsItem {
  const cityName = city.trim() || 'Your City';
  
  return {
    city: cityName,
    country: 'World',
    headline: `Streets of ${cityName} Alive as Communities Flourish in ${year}`,
    snippet: `Citizens in ${cityName} welcomed the season with lively markets, neighborhood gatherings, and quiet anticipation of the future.`,
    localAtmosphere: `Local tram lines, bustling bakeries, and evening radio broadcasts filled the air as the city added your arrival to its rich historical tapestry.`,
    landmark: `The historic heart of ${cityName}`,
  };
}

export function generateDayData(input: UserBirthInput): DayDataPayload {
  const [year, month, day] = input.birthDate.split('-').map(Number);
  const eraArchive = getEraArchive(year);

  const dayFacts = calculateDayFacts(input.birthDate);
  const zodiac = calculateZodiacInfo(input.birthDate, input.birthCity);
  const weather = getHistoricalWeather(input.birthDate, input.birthCity);
  const costOfLiving = calculateCostOfLiving(year);
  const famousBirthdays = getFamousBirthdays(month, day, year);
  const cityNews = getCityNewsItem(input.birthCity, year);

  return {
    input,
    dayFacts,
    zodiac,
    worldNews: eraArchive.worldHeadlines,
    cityNews,
    historicalEvents: eraArchive.events,
    famousBirthdays,
    weather,
    costOfLiving,
    popCulture: {
      billboardSong: eraArchive.song,
      boxOfficeMovie: eraArchive.movie,
      tvShows: eraArchive.tvShows,
      fashionTrends: eraArchive.fashionTrends,
      toysGames: eraArchive.toysGames,
      slang: eraArchive.slang,
    },
    upliftingEvents: eraArchive.uplifting,
    thenVsNow: eraArchive.thenVsNow,
    notableDeaths: eraArchive.notableDeaths,
    sportsMilestone: eraArchive.sportsMilestone,
    classicBook: eraArchive.classicBook,
  };
}
