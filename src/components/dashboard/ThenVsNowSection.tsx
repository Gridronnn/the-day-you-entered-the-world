import React from 'react';
import { DayDataPayload } from '../../types/history';
import { ExternalLink, Info } from 'lucide-react';
import { YellowSemicircleDecal } from '../common/NeoStickers';

export const ThenVsNowSection: React.FC<{
  data: DayDataPayload;
  onOpenTransparency?: () => void;
}> = ({ data, onOpenTransparency }) => {
  const { thenVsNow, input } = data;
  const [year] = input.birthDate.split('-').map(Number);

  return (
    <section id="sec-compare" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF7A00] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-white rotate-[-2deg]">
            7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#00F5FF] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                EPOCH PROGRESSION & DEMOGRAPHICS
              </span>
              {onOpenTransparency && (
                <button
                  type="button"
                  onClick={onOpenTransparency}
                  className="bg-black text-[#FFE600] hover:bg-neutral-800 text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Info className="w-3 h-3" /> UN / WHO Sources
                </button>
              )}
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              Then vs Now
            </h2>
          </div>
        </div>

        <YellowSemicircleDecal size={52} className="hidden sm:block rotate-45" />
      </div>

      {/* Intro Banner */}
      <div className="bg-[#FFE600] border-4 border-black shadow-neo rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <div className="font-display font-black text-base text-black uppercase">
              How the world evolved between {year} and 2026
            </div>
            <p className="font-heading font-semibold text-xs text-neutral-800">
              Verified global transformations sourced from the United Nations, World Health Organization, and International Telecommunication Union.
            </p>
          </div>
        </div>
        <span className="bg-white text-black font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs">
          {2026 - year} Years of Global Progress
        </span>
      </div>

      {/* Comparative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {thenVsNow.map((metric) => (
          <div
            key={metric.title}
            className="neo-card p-6 bg-white space-y-4 hover:-translate-y-1 transition-transform border-3 border-black"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-black uppercase tracking-wider text-neutral-600">
                {metric.category}
              </span>
              <span className="bg-[#C084FC] text-black font-heading font-black text-xs uppercase px-2.5 py-0.5 border-2 border-black rounded shadow-neo-xs">
                {metric.tag}
              </span>
            </div>

            <h3 className="font-display font-black text-2xl text-black">
              {metric.title}
            </h3>

            {/* Side by side comparison */}
            <div className="grid grid-cols-2 gap-3 bg-[#FFFDF0] p-4 border-2 border-black rounded-2xl">
              <div className="space-y-1">
                <div className="text-[10px] font-heading font-black text-neutral-500 uppercase">
                  THEN ({year})
                </div>
                <div className="font-display font-black text-xl text-black">
                  {metric.thenValue}
                </div>
              </div>

              <div className="space-y-1 border-l-2 border-neutral-300 pl-3">
                <div className="text-[10px] font-heading font-black text-[#2563EB] uppercase">
                  LATEST BENCHMARK (2026)
                </div>
                <div className="font-display font-black text-xl text-[#2563EB]">
                  {metric.nowValue}
                </div>
              </div>
            </div>

            <p className="font-heading font-semibold text-xs text-neutral-700 leading-relaxed">
              {metric.changeDescription}
            </p>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-[10px] font-heading font-bold text-neutral-500">
              <span>Observed: {year} vs 2026</span>
              <a
                href={metric.sourceUrl || 'https://population.un.org/wpp/'}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 underline inline-flex items-center gap-1 text-black font-bold"
              >
                {metric.sourceName || 'UN / WHO Official Registry'} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
