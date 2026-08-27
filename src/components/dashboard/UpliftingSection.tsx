import React from 'react';
import { Heart, Sparkles, Trophy, Award, ShieldCheck } from 'lucide-react';
import { DayDataPayload } from '../../types/history';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  YellowSemicircleDecal,
  LilacSparkleDecal,
} from '../common/NeoStickers';

export const UpliftingSection: React.FC<{ data: DayDataPayload }> = ({ data }) => {
  const { upliftingEvents, input } = data;
  const [year] = input.birthDate.split('-').map(Number);

  return (
    <section id="sec-good" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#22E576] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-black rotate-[3deg]">
            6
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                HUMAN HOPE & PROGRESS
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              Happy Things From Your Birth Era
            </h2>
          </div>
        </div>

        <GreenAsteriskDecal size={48} className="hidden sm:block" />
      </div>

      {/* Intro Banner */}
      <div className="bg-[#FF4D8D] text-white border-4 border-black shadow-neo rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 bg-black text-[#FFE600] rounded-full text-xs font-heading font-black uppercase tracking-wider">
            Verified Feel-Good History
          </span>
          <h3 className="font-display font-black text-2xl text-white uppercase mt-1">
            Uplifting Moments & Triumphs of {year}
          </h3>
          <p className="text-xs sm:text-sm font-heading font-semibold text-white/90">
            Inspiring achievements, scientific breakthroughs, peace accords, and conservation milestones that made humanity smile.
          </p>
        </div>
        <span className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-3 py-2 border-2 border-black rounded-xl shadow-neo-xs shrink-0 rotate-[2deg]">
          ✨ Global Hope
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upliftingEvents.map((item, idx) => (
          <div
            key={idx}
            className="neo-card p-6 bg-white space-y-4 hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <span className="bg-[#CCFF00] text-black text-xs font-heading font-black uppercase px-2.5 py-1 border-2 border-black rounded-lg shadow-neo-xs">
                {item.badge}
              </span>
              <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                {item.category}
              </span>
            </div>

            <h4 className="font-display font-black text-xl text-black leading-snug">
              {item.title}
            </h4>

            <p className="font-heading font-semibold text-sm text-neutral-800 leading-relaxed bg-[#FFFDF0] p-4 border-2 border-black rounded-2xl">
              {item.description}
            </p>

            <div className="flex items-center gap-1.5 text-xs font-heading font-bold text-[#22E576]">
              <ShieldCheck className="w-4 h-4 text-[#22E576]" />
              <span className="text-neutral-600 font-mono text-[11px]">Archived Historical Breakthrough</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

