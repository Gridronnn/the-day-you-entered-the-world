import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Compass, FastForward, Play, Pause, ArrowRight, Star, Clock, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../services/audioEngine';

interface TimeTravelSequenceProps {
  targetYear: number;
  birthDate: string;
  birthCity: string;
  onComplete: () => void;
}

const ERA_VIGNETTES: Record<string, { tag: string; headline: string; icon: string; bg: string; text: string }> = {
  '2020s': { tag: 'THE 2020s', headline: 'AI Revolution, Generative Models & Electric Mobility', icon: '🤖', bg: 'bg-[#00F5FF]', text: 'text-black' },
  '2010s': { tag: 'THE 2010s', headline: 'Streaming Media, Smartphones Everywhere & First Black Hole Photo', icon: '📱', bg: 'bg-[#FF4D8D]', text: 'text-white' },
  '2000s': { tag: 'THE 2000s', headline: 'Turn of the Millennium, iPods, Social Web & Mars Rovers', icon: '💿', bg: 'bg-[#FFE600]', text: 'text-black' },
  '1990s': { tag: 'THE 1990s', headline: 'World Wide Web Born, Dial-Up Tones, Tamagotchis & Boy Bands', icon: '💾', bg: 'bg-[#CCFF00]', text: 'text-black' },
  '1980s': { tag: 'THE 1980s', headline: 'Synthwave, Arcade Cabinets, Berlin Wall Falls & MTV', icon: '🕹️', bg: 'bg-[#B75DFF]', text: 'text-white' },
  '1970s': { tag: 'THE 1970s', headline: 'Disco Grooves, Voyager Golden Record, Star Wars & Bell-Bottoms', icon: '🕺', bg: 'bg-[#FF7A00]', text: 'text-black' },
  '1960s': { tag: 'THE 1960s', headline: 'Apollo 11 Moonwalk, Beatlemania, Peace Signs & Civil Rights', icon: '🌕', bg: 'bg-[#22E576]', text: 'text-black' },
  '1950s': { tag: 'THE 1950s', headline: 'Rock & Roll Jukeboxes, Polio Cure, Space Dawn & Technicolor', icon: '📻', bg: 'bg-[#FF3344]', text: 'text-white' },
  '1940s': { tag: 'THE 1940s', headline: 'Post-War Rebuilding, Big Band Jazz, Golden Age of Radio & UN', icon: '🎺', bg: 'bg-[#FFE600]', text: 'text-black' },
  '1930s': { tag: 'THE 1930s', headline: 'Art Deco Architecture, Swing Era & Classic Cinema Golden Age', icon: '🎞️', bg: 'bg-[#00F5FF]', text: 'text-black' },
};

export const TimeTravelSequence: React.FC<TimeTravelSequenceProps> = ({
  targetYear,
  birthDate,
  birthCity,
  onComplete,
}) => {
  const currentYear = 2026;
  const [displayedYear, setDisplayedYear] = useState<number>(currentYear);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isArrived, setIsArrived] = useState<boolean>(false);
  
  const [yStr, mStr, dStr] = birthDate.split('-');
  const dateObj = new Date(Number(yStr), Number(mStr) - 1, Number(dStr));
  const monthName = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();

  const getDecadeKey = (yr: number): string => {
    if (yr >= 2020) return '2020s';
    if (yr >= 2010) return '2010s';
    if (yr >= 2000) return '2000s';
    if (yr >= 1990) return '1990s';
    if (yr >= 1980) return '1980s';
    if (yr >= 1970) return '1970s';
    if (yr >= 1960) return '1960s';
    if (yr >= 1950) return '1950s';
    if (yr >= 1940) return '1940s';
    return '1930s';
  };

  const totalYearsSpan = Math.max(1, currentYear - targetYear);
  const yearsTraversed = currentYear - displayedYear;
  const progressPct = Math.min(100, Math.round((yearsTraversed / totalYearsSpan) * 100));

  // Ticking sound throttler
  const lastTickYearRef = useRef<number>(currentYear);

  useEffect(() => {
    if (isPaused || isArrived) return;

    const baseInterval = Math.max(20, Math.floor(1800 / (totalYearsSpan * speedMultiplier)));
    
    const interval = setInterval(() => {
      setDisplayedYear((prev) => {
        if (prev <= targetYear) {
          clearInterval(interval);
          handleArrival();
          return targetYear;
        }

        // Sound effect tick
        if (Math.abs(prev - lastTickYearRef.current) >= 1) {
          audioEngine.playTimeTravelTick(0.8 + (1 - (prev - targetYear) / totalYearsSpan) * 0.6);
          lastTickYearRef.current = prev;
        }

        const step = totalYearsSpan > 50 ? (speedMultiplier >= 4 ? 2 : 1) : 1;
        const nextYear = prev - step;
        if (nextYear <= targetYear) {
          clearInterval(interval);
          handleArrival();
          return targetYear;
        }
        return nextYear;
      });
    }, baseInterval);

    return () => clearInterval(interval);
  }, [isPaused, isArrived, targetYear, speedMultiplier, totalYearsSpan]);

  const handleArrival = () => {
    setIsArrived(true);
    setDisplayedYear(targetYear);
    audioEngine.playConfettiFanfare();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#00F5FF', '#FF4D8D', '#CCFF00', '#000000'],
      });
    } catch (e) {
      // Confetti fallback
    }

    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  const currentVignette = ERA_VIGNETTES[getDecadeKey(displayedYear)] || ERA_VIGNETTES['1990s'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FFFDF0] text-black overflow-hidden p-4 sm:p-8 select-none">
      
      {/* Background Neo Grid & Floating Starbursts */}
      <div className="absolute inset-0 bg-neo-grid opacity-60 pointer-events-none" />
      <div className="absolute top-12 left-10 text-4xl animate-bounce duration-1000 hidden md:block">⚡</div>
      <div className="absolute top-20 right-14 text-4xl animate-pulse hidden md:block">✦</div>
      <div className="absolute bottom-20 left-16 text-3xl hidden md:block">★</div>
      <div className="absolute bottom-16 right-20 text-4xl animate-spin-slow hidden md:block">🌀</div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4 border-4 border-black bg-white rounded-2xl p-4 shadow-neo-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFE600] border-3 border-black rounded-xl shadow-neo-xs flex items-center justify-center font-display font-black text-lg">
            ⏳
          </div>
          <div>
            <div className="text-[10px] font-heading font-black uppercase text-neutral-600 tracking-wider">
              Time Machine Engaged
            </div>
            <div className="font-display font-black text-sm sm:text-base text-black uppercase">
              Rewinding to {birthCity}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
            className="flex items-center gap-1 bg-[#00F5FF] text-black font-heading font-black text-xs uppercase px-3 py-1.5 border-2 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{speedMultiplier}x Speed</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 bg-white border-2 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5"
            aria-label={isPaused ? 'Resume journey' : 'Pause journey'}
          >
            {isPaused ? <Play className="w-4 h-4 text-black" /> : <Pause className="w-4 h-4 text-black" />}
          </button>
        </div>
      </header>

      {/* Center Stage: The Time Warp Hub */}
      <main className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center my-auto text-center space-y-6">
        
        {/* Animated Flipping Calendar Page Box */}
        <div className="relative group">
          {/* Shadow Box Decal */}
          <div className="absolute -inset-2 bg-black rounded-3xl translate-x-2 translate-y-2 pointer-events-none" />

          <div className="relative bg-[#FFE600] border-4 border-black rounded-3xl p-6 sm:p-10 shadow-neo-lg space-y-4 max-w-lg mx-auto">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b-3 border-black pb-3">
              <span className="bg-black text-white font-heading font-black text-xs uppercase px-3 py-1 rounded-lg">
                DESTINATION: {targetYear}
              </span>
              <span className="bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs">
                {monthName} {dStr}
              </span>
            </div>

            {/* Giant Year Number Display */}
            <div className="py-2 sm:py-3 w-full flex flex-col items-center justify-center overflow-hidden">
              <div
                className="font-display font-black text-black tracking-tight leading-none filter drop-shadow-[4px_4px_0px_#FFF] select-none text-center tabular-nums transition-all duration-75 max-w-full px-2"
                style={{
                  fontSize:
                    String(displayedYear).length >= 5
                      ? 'clamp(2rem, 8.5vw, 3.75rem)'
                      : String(displayedYear).length === 4
                      ? 'clamp(2.75rem, 11vw, 5.25rem)'
                      : 'clamp(3.5rem, 15vw, 6.5rem)',
                  lineHeight: 1.05,
                }}
              >
                {displayedYear}
              </div>
              <div className="font-heading font-extrabold text-xs sm:text-sm md:text-base text-neutral-800 mt-2.5 uppercase tracking-wide">
                {isArrived ? '✨ YOU HAVE ARRIVED! ✨' : `Rewinding ${displayedYear - targetYear} more years...`}
              </div>
            </div>

            {/* Decade Vignette Pill */}
            <div className={`p-4 border-3 border-black rounded-2xl shadow-neo-sm ${currentVignette.bg} ${currentVignette.text} text-left transition-all duration-300`}>
              <div className="flex items-center justify-between text-xs font-heading font-black uppercase tracking-wider mb-1">
                <span>{currentVignette.tag}</span>
                <span className="text-lg">{currentVignette.icon}</span>
              </div>
              <div className="font-heading font-bold text-xs sm:text-sm line-clamp-2">
                {currentVignette.headline}
              </div>
            </div>
          </div>
        </div>

        {/* Journey Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between text-xs font-heading font-black uppercase tracking-wider text-black">
            <span>2026 (Today)</span>
            <span className="bg-black text-white px-2 py-0.5 rounded">{progressPct}% Traversed</span>
            <span>{targetYear} (Your Birth)</span>
          </div>
          <div className="w-full bg-white border-3 border-black rounded-full h-5 p-0.5 shadow-neo-sm overflow-hidden">
            <div
              className="bg-[#22E576] h-full rounded-full border border-black transition-all duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

      </main>

      {/* Bottom Footer Actions */}
      <footer className="relative z-10 w-full max-w-md flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleArrival}
          className="w-full flex items-center justify-center gap-2 bg-[#FF4D8D] text-white font-heading font-black text-sm uppercase px-6 py-3.5 border-3 border-black rounded-2xl shadow-neo hover:-translate-y-1 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <span>Skip to Birth Date</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </footer>

    </div>
  );
};

export default TimeTravelSequence;
