import React from 'react';
import { DayDataPayload } from '../../types/history';
import { Newspaper, MapPin, ExternalLink, Calendar, Info } from 'lucide-react';
import { BlueDonutDecal } from '../common/NeoStickers';

export const WorldNewsSection: React.FC<{
  data: DayDataPayload;
  onOpenTransparency?: () => void;
}> = ({ data, onOpenTransparency }) => {
  const { worldNews, cityNews, input } = data;
  const [year] = input.birthDate.split('-').map(Number);

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
                VERIFIED HISTORICAL CHRONICLES
              </span>
              {onOpenTransparency && (
                <button
                  type="button"
                  onClick={onOpenTransparency}
                  className="bg-black text-[#FFE600] hover:bg-neutral-800 text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Info className="w-3 h-3" /> Archive Sources
                </button>
              )}
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
              <Newspaper className="w-4 h-4" /> WIKIMEDIA GLOBAL DISPATCHES
            </span>
            <span className="text-[10px] font-mono text-neutral-300">
              ARCHIVE EDITION: {input.birthDate}
            </span>
          </div>

          <div className="space-y-4">
            {worldNews.map((news) => {
              const isUnavailable = news.status === 'unavailable';

              return (
                <div
                  key={news.id}
                  className={`neo-card p-5 bg-white space-y-3 transition-all hover:translate-x-1 border-3 border-black ${
                    isUnavailable ? 'opacity-90 bg-neutral-50' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-black font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs ${
                      isUnavailable ? 'bg-neutral-300' : 'bg-[#FFE600]'
                    }`}>
                      {news.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {news.observedAt && (
                        <span className="text-[10px] font-mono text-neutral-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          {news.observedAt}
                        </span>
                      )}
                      <span className="bg-[#CCFF00] text-black font-heading font-bold text-[9px] uppercase px-1.5 py-0.5 border border-black rounded">
                        {news.status === 'unavailable' ? 'ARCHIVE GAP' : 'HISTORICAL RECORD'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-xl text-black leading-snug">
                    {news.title}
                  </h3>

                  <p className="font-heading font-semibold text-sm text-neutral-700 leading-relaxed">
                    {news.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-200">
                    <span className="text-[10px] font-heading font-bold text-neutral-500">
                      Src: {news.source}
                    </span>
                    {news.sourceUrl && (
                      <a
                        href={news.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-heading font-bold text-blue-600 hover:text-black inline-flex items-center gap-1 underline transition-colors"
                      >
                        Read Wikipedia Archive <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: City Spotlight & Local News */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FF7A00] text-black px-4 py-2 border-3 border-black rounded-xl shadow-neo-xs flex items-center justify-between">
            <span className="font-heading font-black text-xs tracking-widest uppercase flex items-center gap-1.5 text-white">
              <MapPin className="w-4 h-4 text-white" /> PLACE SPOTLIGHT: {input.birthCity.toUpperCase()}
            </span>
            <span className="bg-white text-black font-heading font-black text-[9px] uppercase px-1.5 py-0.5 rounded border border-black">
              LOCAL TAPESTRY
            </span>
          </div>

          <div className="neo-card p-6 bg-[#FFFDF0] space-y-4 border-3 border-black">
            <div className="inline-block bg-[#22C55E] text-black font-heading font-black text-xs uppercase px-2.5 py-1 border-2 border-black rounded-md shadow-neo-xs">
              📍 REGIONAL CHRONICLE ({year})
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
            <div className="text-[10px] font-heading font-bold text-neutral-500 pt-2 border-t border-black/10">
              Landmark: {cityNews.landmark}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
