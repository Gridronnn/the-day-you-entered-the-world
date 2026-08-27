import React from 'react';
import { DayDataPayload } from '../../types/history';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  YellowSemicircleDecal,
  LilacSparkleDecal,
  NeoBadge,
} from '../common/NeoStickers';
import { Heart, Wind, Moon, Sun, Sparkles, Compass, Star, Gift, Clock } from 'lucide-react';

export const ArrivalSection: React.FC<{ data: DayDataPayload }> = ({ data }) => {
  const { input, dayFacts, zodiac } = data;

  const renderMoonSvg = () => {
    // Moon phase visualizer
    const pct = zodiac.moonPhase.illuminationPct;
    return (
      <div className="relative w-28 h-28 mx-auto bg-black rounded-full border-3 border-black shadow-neo-sm overflow-hidden flex items-center justify-center">
        {/* Base dark moon */}
        <div className="absolute inset-0 bg-[#1A1D26]" />
        {/* Illuminated portion */}
        <div
          className="absolute inset-0 bg-[#FFE600] rounded-full transition-all"
          style={{
            clipPath:
              zodiac.moonPhase.phaseType.includes('waxing') || zodiac.moonPhase.phaseType === 'first_quarter'
                ? `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, ${50 - (pct - 50) * 1.5}% 50%)`
                : zodiac.moonPhase.phaseType === 'full'
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                : `polygon(0% 0%, 50% 0%, ${50 + (pct - 50) * 1.5}% 50%, 50% 100%, 0% 100%)`,
          }}
        />
        {/* Crater details */}
        <div className="absolute top-4 left-6 w-3 h-3 rounded-full bg-black/15" />
        <div className="absolute bottom-5 right-7 w-5 h-5 rounded-full bg-black/15" />
        <div className="absolute top-10 right-5 w-2 h-2 rounded-full bg-black/15" />
        <span className="relative z-10 text-xs font-mono font-black text-black bg-white/90 px-2 py-0.5 border border-black rounded shadow-neo-xs">
          {pct}% LIT
        </span>
      </div>
    );
  };

  return (
    <section id="sec-arrival" className="space-y-6 pt-4">
      
      {/* Section Header with Neo-Stickers */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#22C55E] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-black rotate-[-3deg]">
            1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                ORIGINS & CELESTIAL SKY
              </span>
              <span className="text-xs font-mono font-bold text-neutral-600">
                JULIAN DAY: #{dayFacts.julianDay}
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              Your Arrival
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GreenAsteriskDecal size={48} className="hidden sm:block" />
          <div className="bg-white border-3 border-black shadow-neo rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] font-heading font-black uppercase text-neutral-500">
              DAY OF THE WEEK
            </div>
            <div className="font-display font-black text-lg text-[#2563EB]">
              {dayFacts.dayOfWeek}
            </div>
          </div>
        </div>
      </div>

      {/* Heartfelt Hero Quote Banner */}
      <div className="relative bg-[#FFE600] border-4 border-black shadow-neo-md rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="absolute -top-4 -right-4 opacity-20 pointer-events-none">
          <PinkZigzagDecal size={160} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white text-black text-xs font-heading font-black uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D8D]" /> A Heartfelt Cosmic Truth
          </div>
          <blockquote className="font-display font-black text-2xl sm:text-3xl text-black leading-snug">
            “On this day, while the world was busy living its story, you arrived and began yours.”
          </blockquote>
          <p className="font-heading font-bold text-sm text-black/80">
            Born on <span className="underline decoration-2">{dayFacts.dayOfWeek}, {input.birthDate}</span> in{' '}
            <span className="underline decoration-2">{input.birthCity}</span>. Here is how the cosmos aligned when you drew your first breath.
          </p>
        </div>
      </div>

      {/* 4 Core Astrological & Celestial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Western Zodiac */}
        <div className="neo-card p-6 space-y-4 relative bg-white">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <span className="text-xs font-heading font-black uppercase tracking-wider text-neutral-600">
              WESTERN ZODIAC
            </span>
            <span className="bg-[#FF4D8D] text-white font-heading font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-neo-xs">
              {zodiac.western.element} Sign
            </span>
          </div>

          <div className="text-center space-y-2 py-1">
            <div className="w-16 h-16 bg-[#FFE600] border-3 border-black rounded-2xl shadow-neo mx-auto flex items-center justify-center text-3xl font-black">
              {zodiac.western.symbol}
            </div>
            <h3 className="font-display font-black text-2xl text-black uppercase">
              {zodiac.western.sign}
            </h3>
            <p className="text-xs font-heading font-bold text-neutral-600">
              Ruling Planet: <span className="text-black font-black">{zodiac.western.rulingPlanet}</span>
            </p>
          </div>

          <div className="space-y-2 pt-1 border-t-2 border-neutral-200">
            <div className="text-[11px] font-heading font-black text-neutral-500 uppercase">
              Key Strengths:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {zodiac.western.traits.map((trait) => (
                <span
                  key={trait}
                  className="bg-[#FFFDF0] text-black text-[11px] font-heading font-bold border border-black px-2 py-0.5 rounded shadow-neo-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Chinese Zodiac */}
        <div className="neo-card p-6 space-y-4 relative bg-white">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <span className="text-xs font-heading font-black uppercase tracking-wider text-neutral-600">
              CHINESE ZODIAC
            </span>
            <span className="bg-[#CCFF00] text-black font-heading font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-neo-xs">
              {zodiac.chinese.polarity} ({zodiac.chinese.element})
            </span>
          </div>

          <div className="text-center space-y-2 py-1">
            <div className="w-16 h-16 bg-[#00F5FF] border-3 border-black rounded-2xl shadow-neo mx-auto flex items-center justify-center text-3xl font-black">
              🐉
            </div>
            <h3 className="font-display font-black text-2xl text-black uppercase">
              Year of the {zodiac.chinese.animal}
            </h3>
            <p className="text-xs font-heading font-bold text-neutral-600">
              Wu Xing Element: <span className="text-black font-black">{zodiac.chinese.element}</span>
            </p>
          </div>

          <div className="space-y-2 pt-1 border-t-2 border-neutral-200">
            <div className="text-[11px] font-heading font-black text-neutral-500 uppercase">
              Animal Archetype:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {zodiac.chinese.traits.map((trait) => (
                <span
                  key={trait}
                  className="bg-[#FFFDF0] text-black text-[11px] font-heading font-bold border border-black px-2 py-0.5 rounded shadow-neo-xs"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Moon Phase */}
        <div className="neo-card p-6 space-y-4 relative bg-white">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <span className="text-xs font-heading font-black uppercase tracking-wider text-neutral-600">
              MOON PHASE
            </span>
            <span className="bg-[#C084FC] text-black font-heading font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-neo-xs">
              Day {zodiac.moonPhase.ageDays} / 29.5
            </span>
          </div>

          {renderMoonSvg()}

          <div className="text-center space-y-1">
            <h3 className="font-display font-black text-xl text-black uppercase">
              {zodiac.moonPhase.name}
            </h3>
            <p className="text-xs font-heading font-bold text-neutral-600 leading-tight">
              {zodiac.moonPhase.poeticMeaning}
            </p>
          </div>
        </div>

        {/* Card 4: Vitality & Heartbeats Ticker */}
        <div className="neo-card p-6 space-y-4 relative bg-[#FFFDF0]">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <span className="text-xs font-heading font-black uppercase tracking-wider text-neutral-600">
              VITALITY STATS
            </span>
            <span className="bg-[#22C55E] text-black font-heading font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-neo-xs">
              ALIVE & THRIVING
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs">
              <div className="flex items-center gap-2 text-xs font-heading font-black text-neutral-500 uppercase">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> Total Days Lived
              </div>
              <div className="font-display font-black text-2xl text-black">
                {dayFacts.daysLived.toLocaleString()} Days
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs">
              <div className="flex items-center gap-2 text-xs font-heading font-black text-neutral-500 uppercase">
                <Heart className="w-3.5 h-3.5 text-[#FF4D8D] animate-pulse" /> Estimated Heartbeats
              </div>
              <div className="font-display font-black text-xl text-[#FF4D8D]">
                ~{(dayFacts.heartbeats / 1000000000).toFixed(2)} Billion
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs">
              <div className="flex items-center gap-2 text-xs font-heading font-black text-neutral-500 uppercase">
                <Wind className="w-3.5 h-3.5 text-[#00F5FF]" /> Estimated Breaths
              </div>
              <div className="font-display font-black text-xl text-[#2563EB]">
                ~{(dayFacts.breaths / 1000000).toFixed(1)} Million
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Birthstone & Birth Flower Banner Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Birthstone */}
        <div className="bg-white border-3 border-black shadow-neo rounded-2xl p-4 flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-xl border-2 border-black shadow-neo-xs flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: zodiac.birthstone.color }}
          >
            💎
          </div>
          <div>
            <div className="text-[10px] font-heading font-black text-neutral-500 uppercase">
              BIRTHSTONE
            </div>
            <div className="font-display font-black text-base text-black">
              {zodiac.birthstone.modern}
            </div>
            <p className="text-[11px] font-heading font-semibold text-neutral-600">
              {zodiac.birthstone.meaning}
            </p>
          </div>
        </div>

        {/* Birth Flower */}
        <div className="bg-white border-3 border-black shadow-neo rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 bg-[#FF4D8D] rounded-xl border-2 border-black shadow-neo-xs flex items-center justify-center text-xl shrink-0 text-white">
            🌸
          </div>
          <div>
            <div className="text-[10px] font-heading font-black text-neutral-500 uppercase">
              BIRTH FLOWER
            </div>
            <div className="font-display font-black text-base text-black">
              {zodiac.birthFlower.name}
            </div>
            <p className="text-[11px] font-heading font-semibold text-neutral-600">
              {zodiac.birthFlower.symbolism}
            </p>
          </div>
        </div>

        {/* Season */}
        <div className="bg-white border-3 border-black shadow-neo rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-12 h-12 bg-[#FFE600] rounded-xl border-2 border-black shadow-neo-xs flex items-center justify-center text-xl shrink-0 text-black">
            ☀️
          </div>
          <div>
            <div className="text-[10px] font-heading font-black text-neutral-500 uppercase">
              BIRTH SEASON
            </div>
            <div className="font-display font-black text-base text-black">
              {zodiac.season} in {input.birthCity}
            </div>
            <p className="text-[11px] font-heading font-semibold text-neutral-600">
              Day #{dayFacts.dayOfYear} of the cosmic year
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
