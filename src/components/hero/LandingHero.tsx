import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, User, Music, ArrowRight, Compass, Volume2, VolumeX, Shuffle } from 'lucide-react';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  YellowSemicircleDecal,
  LilacSparkleDecal,
  NeoBadge,
} from '../common/NeoStickers';

interface LandingHeroProps {
  onStartJourney: (data: { birthDate: string; birthCity: string; userName: string }) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

const POPULAR_CITIES = [
  'New York, USA',
  'London, UK',
  'Tokyo, Japan',
  'Paris, France',
  'Mumbai, India',
  'Sydney, Australia',
  'Toronto, Canada',
  'Berlin, Germany',
  'Rome, Italy',
  'Cairo, Egypt',
  'Singapore',
  'Los Angeles, USA',
  'Chicago, USA',
  'San Francisco, USA',
  'Dubai, UAE',
  'São Paulo, Brazil',
  'Seoul, South Korea',
  'Madrid, Spain',
];

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartJourney,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('07');
  const [year, setYear] = useState('1995');
  const [city, setCity] = useState('New York');
  const [name, setName] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCity(val);
    if (val.trim().length > 0) {
      const matches = POPULAR_CITIES.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredCities(matches);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const selectCity = (cityName: string) => {
    setCity(cityName.split(',')[0]);
    setShowCitySuggestions(false);
  };

  const handlePreset = (y: string, m: string, d: string, c: string) => {
    setYear(y);
    setMonth(m);
    setDay(d);
    setCity(c);
  };

  const handleRandomDate = () => {
    const randomYear = Math.floor(Math.random() * (2020 - 1950 + 1)) + 1950;
    const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const randomCity = POPULAR_CITIES[Math.floor(Math.random() * POPULAR_CITIES.length)].split(',')[0];
    setYear(String(randomYear));
    setMonth(randomMonth);
    setDay(randomDay);
    setCity(randomCity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');
    const birthDate = `${year}-${formattedMonth}-${formattedDay}`;
    onStartJourney({
      birthDate,
      birthCity: city.trim() || 'New York',
      userName: name.trim(),
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#00C2FF] flex flex-col justify-between">
      {/* Neo-Brutalist Asymmetric Background: Cyan on left, Yellow Grid on right */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-[#FFE600] bg-neo-grid border-l-0 lg:border-l-4 border-black pointer-events-none z-0" />

      {/* Floating Decorative Decals & Stickers (matching reference image) */}
      <div className="absolute top-8 left-6 z-10 hidden sm:block animate-bounce duration-1000">
        <GreenAsteriskDecal size={68} className="rotate-12" />
      </div>
      <div className="absolute top-16 right-12 z-10 hidden md:block">
        <PinkZigzagDecal size={80} />
      </div>
      <div className="absolute bottom-12 left-10 z-10 hidden lg:block">
        <BlueDonutDecal size={72} className="-rotate-6" />
      </div>
      <div className="absolute bottom-24 right-8 z-10 hidden sm:block">
        <YellowSemicircleDecal size={64} className="rotate-45" />
      </div>
      <div className="absolute top-1/2 right-1/4 z-10 hidden xl:block">
        <LilacSparkleDecal size={42} />
      </div>
      <div className="absolute top-1/3 left-1/3 z-10 hidden xl:block">
        <OrangeWavyBlobDecal size={56} className="rotate-12" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 px-4 sm:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white border-3 border-black rounded-xl shadow-neo flex items-center justify-center font-display font-black text-xl text-black rotate-[-3deg]">
            ⏳
          </div>
          <div>
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-black uppercase block leading-none">
              The Day You
            </span>
            <span className="font-heading font-extrabold text-xs tracking-widest text-black bg-[#FFE600] px-1.5 py-0.5 border border-black rounded shadow-neo-xs uppercase">
              Entered The World
            </span>
          </div>
        </div>

        {/* Ambient Audio Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          className="neo-button-white text-xs sm:text-sm py-2 px-3 sm:px-4"
          title="Toggle Nostalgic Synth Ambient Audio"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-[#FF4D8D] animate-pulse" />
              <span className="hidden sm:inline">Sound: ON 🎶</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-neutral-500" />
              <span className="hidden sm:inline">Sound: OFF</span>
            </>
          )}
        </button>
      </header>

      {/* Main Hero Content Area */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 py-6 lg:py-10 w-full flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Heading & Emotional Pitch */}
          <div className="lg:col-span-6 text-left space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs rotate-[-2deg]">
                ⚡ Nostalgic Time Travel Machine
              </span>
              <span className="bg-[#CCFF00] text-black font-heading font-bold text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs hidden sm:inline-block rotate-[2deg]">
                1930 – 2026
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-black tracking-tight leading-[1.08] uppercase">
              Travel Back To The Day Your{' '}
              <span className="relative inline-block px-2 bg-[#FFE600] border-3 border-black shadow-neo-sm rotate-[1.5deg]">
                Story Began
              </span>
            </h1>

            <p className="font-heading font-semibold text-base sm:text-lg text-black/90 max-w-xl leading-relaxed">
              Step into the world as it stood the exact moment you took your first breath. Discover the #1 song, headlines, historical weather, what life cost, and the cosmic sky above your birth city.
            </p>

            {/* Quick Preset Badges */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-heading font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Quick Historic Moments:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePreset('2000', '01', '01', 'Sydney')}
                  className="bg-white hover:bg-[#FFE600] text-black text-xs font-heading font-bold border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-xs transition-all active:translate-y-0.5"
                >
                  🎉 Millennium 2000
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('1969', '07', '20', 'Houston')}
                  className="bg-white hover:bg-[#FFE600] text-black text-xs font-heading font-bold border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-xs transition-all active:translate-y-0.5"
                >
                  🌕 Moon Landing 1969
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('1989', '11', '09', 'Berlin')}
                  className="bg-white hover:bg-[#FFE600] text-black text-xs font-heading font-bold border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-xs transition-all active:translate-y-0.5"
                >
                  🧱 Berlin Wall 1989
                </button>
                <button
                  type="button"
                  onClick={handleRandomDate}
                  className="bg-[#C084FC] hover:bg-[#A855F7] text-black text-xs font-heading font-black border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-xs transition-all active:translate-y-0.5 flex items-center gap-1"
                >
                  <Shuffle className="w-3 h-3" /> Random 🎲
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Neo-Brutalist Input Card */}
          <div className="lg:col-span-6 relative">
            {/* Background offset card decoration */}
            <div className="absolute inset-0 bg-[#FF4D8D] border-4 border-black rounded-3xl translate-x-3 translate-y-3 hidden sm:block z-0" />

            <div className="relative z-10 bg-white border-4 border-black shadow-neo-lg rounded-3xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b-3 border-black pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#FFE600] border-2 border-black rounded-full flex items-center justify-center font-bold text-base shadow-neo-xs">
                    📅
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-black uppercase">
                      Enter Your Origins
                    </h2>
                    <p className="text-xs font-heading font-bold text-neutral-600">
                      Set your coordinates in space and time
                    </p>
                  </div>
                </div>
                <span className="bg-[#22C55E] text-black font-heading font-black text-xs uppercase px-2.5 py-1 border-2 border-black rounded-md shadow-neo-xs">
                  READY
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Date of Birth Pickers */}
                <div className="space-y-2">
                  <label className="block text-xs font-heading font-black uppercase tracking-wider text-black">
                    Date of Birth <span className="text-[#FF4D8D]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {/* Day */}
                    <div>
                      <span className="text-[10px] font-heading font-bold text-neutral-500 block mb-1">DAY</span>
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="neo-input w-full text-center text-base font-bold py-2.5 px-1 bg-[#FFFDF0]"
                      >
                        {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Month */}
                    <div>
                      <span className="text-[10px] font-heading font-bold text-neutral-500 block mb-1">MONTH</span>
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="neo-input w-full text-center text-base font-bold py-2.5 px-1 bg-[#FFFDF0]"
                      >
                        {[
                          { val: '01', name: 'Jan' },
                          { val: '02', name: 'Feb' },
                          { val: '03', name: 'Mar' },
                          { val: '04', name: 'Apr' },
                          { val: '05', name: 'May' },
                          { val: '06', name: 'Jun' },
                          { val: '07', name: 'Jul' },
                          { val: '08', name: 'Aug' },
                          { val: '09', name: 'Sep' },
                          { val: '10', name: 'Oct' },
                          { val: '11', name: 'Nov' },
                          { val: '12', name: 'Dec' },
                        ].map((m) => (
                          <option key={m.val} value={m.val}>
                            {m.val} - {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Year */}
                    <div>
                      <span className="text-[10px] font-heading font-bold text-neutral-500 block mb-1">YEAR</span>
                      <input
                        type="number"
                        min="1920"
                        max="2026"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="neo-input w-full text-center text-base font-bold py-2.5 px-1 bg-[#FFFDF0]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Birth City with Autocomplete */}
                <div className="space-y-2 relative">
                  <label className="block text-xs font-heading font-black uppercase tracking-wider text-black">
                    Birth City / Place of Origin <span className="text-[#FF4D8D]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                      <MapPin className="w-5 h-5 text-neutral-500 shrink-0" />
                    </div>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={handleCityChange}
                      onFocus={() => {
                        if (city.trim().length > 0) setShowCitySuggestions(true);
                      }}
                      placeholder="e.g. London, New York, Mumbai, Tokyo"
                      style={{ paddingLeft: '44px' }}
                      className="neo-input w-full !pl-[44px] text-base bg-[#FFFDF0] h-12 flex items-center"
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showCitySuggestions && filteredCities.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border-3 border-black shadow-neo-md rounded-xl z-50 max-h-48 overflow-y-auto divide-y-2 divide-neutral-200">
                      {filteredCities.map((cityName) => (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => selectCity(cityName)}
                          className="w-full text-left px-4 py-2.5 font-heading font-bold text-sm hover:bg-[#FFE600] transition-colors flex items-center justify-between"
                        >
                          <span>{cityName}</span>
                          <span className="text-xs text-neutral-500">Select ↵</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Name (Optional for Memory Card) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-heading font-black uppercase tracking-wider text-black">
                      Your Name / Nickname
                    </label>
                    <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase">
                      Optional for Memory Card
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                      <User className="w-5 h-5 text-neutral-500 shrink-0" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya, Alex, Christopher"
                      style={{ paddingLeft: '44px' }}
                      className="neo-input w-full !pl-[44px] text-base bg-[#FFFDF0] h-12 flex items-center"
                    />
                  </div>
                </div>

                {/* Submit CTA Button (Lilac style matching reference image 'Get started' button!) */}
                <button
                  type="submit"
                  className="w-full bg-[#C084FC] hover:bg-[#B75DFF] text-black font-heading font-black text-lg border-3 border-black shadow-neo rounded-2xl py-4 px-6 transition-all duration-150 hover:-translate-y-1 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 uppercase tracking-wide group"
                >
                  <span>Begin My Journey</span>
                  <div className="w-8 h-8 bg-[#FFE600] border-2 border-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5 text-black" />
                  </div>
                </button>

                <p className="text-[11px] font-heading font-bold text-center text-neutral-600">
                  ✨ Instant calculation: Western & Chinese Zodiac, Moon Phase, #1 Hits & Historical Archives
                </p>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Marquee Footer Banner */}
      <footer className="relative z-20 bg-black text-[#FFE600] py-2.5 border-t-3 border-black overflow-hidden font-mono font-bold text-xs uppercase tracking-widest">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>⚡ THE DAY YOU ENTERED THE WORLD</span>
          <span>★ TIME TRAVEL EXPLORER</span>
          <span>● CELESTIAL ALIGNMENT & MOON PHASES</span>
          <span>▲ BILLBOARD NO. 1 SONGS & CINEMA HITS</span>
          <span>◆ WHAT LIFE COST THEN VS NOW</span>
          <span>⚡ THE DAY YOU ENTERED THE WORLD</span>
          <span>★ TIME TRAVEL EXPLORER</span>
          <span>● CELESTIAL ALIGNMENT & MOON PHASES</span>
          <span>▲ BILLBOARD NO. 1 SONGS & CINEMA HITS</span>
          <span>◆ WHAT LIFE COST THEN VS NOW</span>
        </div>
      </footer>
    </div>
  );
};
