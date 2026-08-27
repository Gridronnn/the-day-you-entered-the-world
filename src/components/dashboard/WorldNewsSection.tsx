import React from 'react';
import { DayDataPayload } from '../../types/history';
import { Newspaper, Globe, Sparkles, MapPin, Award, BookOpen, Trophy } from 'lucide-react';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  LilacSparkleDecal,
  NeoBadge,
} from '../common/NeoStickers';

export const WorldNewsSection: React.FC<{ data: DayDataPayload }> = ({ data }) => {
  const { worldNews, cityNews, historicalEvents, famousBirthdays, input } = data;

  return (
    <section id="sec-world" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#00F5FF] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-black rotate-[2deg]">
            2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                GLOBAL & LOCAL CHRONICLES
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              The World That Day
            </h2>
          </div>
        </div>

        <BlueDonutDecal size={48} className="hidden sm:block" />
      </div>

      {/* Main Grid: World Headlines + City Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: World Headlines Newspaper Collage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-black text-white px-4 py-2 border-3 border-black rounded-xl shadow-neo-xs flex items-center justify-between">
            <span className="font-heading font-black text-xs tracking-widest uppercase flex items-center gap-1.5 text-[#FFE600]">
              <Newspaper className="w-4 h-4" /> GLOBAL HEADLINES ARCHIVE
            </span>
            <span className="text-[10px] font-mono text-neutral-300">
              EDITION: {input.birthDate}
            </span>
          </div>

          <div className="space-y-4">
            {worldNews.map((news, idx) => (
              <div
                key={news.id}
                className="neo-card p-5 bg-white space-y-2.5 transition-all hover:translate-x-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-[#FFE600] text-black font-heading font-black text-[11px] uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                    {news.category}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-neutral-500">
                    Source: {news.source}
                  </span>
                </div>
                <h3 className="font-display font-black text-xl text-black leading-snug">
                  {news.title}
                </h3>
                <p className="font-heading font-semibold text-sm text-neutral-700 leading-relaxed">
                  {news.description}
                </p>
                <div className="inline-block bg-[#00F5FF]/20 text-black text-[11px] font-heading font-bold px-2 py-0.5 rounded border border-black/30">
                  ✨ Impact: {news.impactTag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: City Spotlight & Local News */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FF7A00] text-black px-4 py-2 border-3 border-black rounded-xl shadow-neo-xs flex items-center justify-between">
            <span className="font-heading font-black text-xs tracking-widest uppercase flex items-center gap-1.5 text-white">
              <MapPin className="w-4 h-4" /> CITY SPOTLIGHT: {input.birthCity.toUpperCase()}
            </span>
          </div>

          <div className="neo-card p-6 bg-[#FFFDF0] space-y-4">
            <div className="inline-block bg-[#22C55E] text-black font-heading font-black text-xs uppercase px-2.5 py-1 border-2 border-black rounded-md shadow-neo-xs">
              📍 LOCAL ATMOSPHERE
            </div>
            <h3 className="font-display font-black text-xl text-black leading-snug">
              {cityNews.headline}
            </h3>
            <p className="font-heading font-semibold text-sm text-neutral-800 leading-relaxed">
              {cityNews.snippet}
            </p>
            <p className="font-heading font-semibold text-xs text-neutral-600 italic bg-white p-3 border-2 border-black rounded-xl">
              "{cityNews.localAtmosphere}"
            </p>
          </div>

          {/* Historical Breakthroughs Timeline */}
          <div className="space-y-3">
            <div className="text-xs font-heading font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#FF4D8D]" /> Era Milestones & Breakthroughs:
            </div>
            {historicalEvents.map((evt) => (
              <div
                key={evt.title}
                className="bg-white border-2 border-black rounded-xl p-3.5 shadow-neo-xs flex items-start gap-3"
              >
                <div className="bg-[#C084FC] border border-black px-2 py-1 rounded text-xs font-mono font-bold text-black shrink-0">
                  {evt.year}
                </div>
                <div>
                  <div className="font-heading font-black text-sm text-black">
                    {evt.title}
                  </div>
                  <div className="text-xs font-heading font-semibold text-neutral-600">
                    {evt.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Famous People Born on the Same Day */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-2.5 py-1 border-2 border-black rounded-md shadow-neo-xs">
              🌟 SHARED BIRTHDAYS
            </span>
            <h3 className="font-display font-black text-xl text-black uppercase">
              Icons Who Share Your Day Spirit
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {famousBirthdays.map((person) => (
            <div
              key={person.name}
              className="neo-card p-5 bg-white space-y-3 relative hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFE600] border-2 border-black rounded-2xl shadow-neo-xs flex items-center justify-center text-2xl shrink-0">
                  {person.emoji}
                </div>
                <div>
                  <h4 className="font-display font-black text-base text-black leading-tight">
                    {person.name}
                  </h4>
                  <div className="text-xs font-heading font-bold text-neutral-500">
                    {person.role} ({person.year})
                  </div>
                </div>
              </div>
              {person.quote && (
                <blockquote className="text-xs font-heading font-semibold text-neutral-700 italic bg-[#FFFDF0] p-2.5 border border-black rounded-lg">
                  "{person.quote}"
                </blockquote>
              )}
              <div className="text-[11px] font-heading font-black text-[#2563EB] uppercase">
                ✦ Known for: {person.knownFor}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sports Milestone, Literature Bestseller & Historical Tributes Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* 1. Sports Championship */}
        {data.sportsMilestone && (
          <div
            className="border-3 border-black rounded-xl shadow-neo p-5 space-y-2 relative overflow-hidden text-black"
            style={{ backgroundColor: '#CCFF00' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-black text-[#CCFF00] rounded-lg flex items-center justify-center font-black text-xs">
                🏆
              </span>
              <span className="font-heading font-black text-xs uppercase tracking-wider text-black bg-white px-2 py-0.5 border border-black rounded shadow-neo-xs">
                Sports Triumph
              </span>
            </div>
            <div className="font-display font-black text-base text-black uppercase leading-tight">
              {data.sportsMilestone.title}
            </div>
            <div className="text-xs font-heading font-bold text-black/85">
              👑 Champion: {data.sportsMilestone.champion}
            </div>
            <p className="text-xs font-heading font-semibold text-black/75 leading-relaxed">
              {data.sportsMilestone.detail}
            </p>
          </div>
        )}

        {/* 2. Classic Book */}
        {data.classicBook && (
          <div
            className="border-3 border-black rounded-xl shadow-neo p-5 space-y-2 relative overflow-hidden text-black"
            style={{ backgroundColor: '#00F5FF' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-black text-[#00F5FF] rounded-lg flex items-center justify-center font-black text-xs">
                📖
              </span>
              <span className="font-heading font-black text-xs uppercase tracking-wider text-black bg-white px-2 py-0.5 border border-black rounded shadow-neo-xs">
                Literary Bestseller
              </span>
            </div>
            <div className="font-display font-black text-base text-black uppercase leading-tight">
              {data.classicBook.title}
            </div>
            <div className="text-xs font-heading font-bold text-black/85">
              ✍️ By {data.classicBook.author}
            </div>
            <p className="text-xs font-heading font-semibold text-black/75 leading-relaxed">
              {data.classicBook.impact}
            </p>
          </div>
        )}

        {/* 3. Notable Tributes */}
        {data.notableDeaths && data.notableDeaths.length > 0 && (
          <div
            className="border-3 border-black rounded-xl shadow-neo p-5 space-y-2 relative overflow-hidden text-white"
            style={{ backgroundColor: '#FF4D8D' }}
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-black text-[#FFE600] rounded-lg flex items-center justify-center font-black text-xs">
                🕯️
              </span>
              <span className="font-heading font-black text-xs uppercase tracking-wider text-black bg-[#FFE600] px-2 py-0.5 border border-black rounded shadow-neo-xs">
                Notable Tributes
              </span>
            </div>
            {data.notableDeaths.slice(0, 1).map((tribute) => (
              <div key={tribute.name} className="space-y-1">
                <div className="font-display font-black text-base text-white uppercase leading-tight">
                  {tribute.name} ({tribute.year})
                </div>
                <div className="text-xs font-heading font-bold text-[#FFFDF0]">
                  ✦ {tribute.role}
                </div>
                <p className="text-xs font-heading font-semibold text-white/95 leading-relaxed">
                  {tribute.legacy}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
};

