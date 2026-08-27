import React from 'react';
import { X, ShieldCheck, Database, Compass, Music, CloudSun, DollarSign, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSourcesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FFFDF0] border-4 border-black rounded-3xl shadow-neo-xl p-6 max-h-[88vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center shadow-neo-xs">
              <Database className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-black uppercase tracking-tight">
                Data Sources & Methodology
              </h2>
              <p className="text-xs font-heading font-bold text-neutral-600">
                A Sourced Historical Reconstruction Powered by Verifiable Archives
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 bg-white hover:bg-[#FF453A] hover:text-white border-2 border-black rounded-xl flex items-center justify-center shadow-neo-xs transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-3.5 bg-[#FFF066] border-2 border-black rounded-2xl shadow-neo-xs text-xs font-heading font-bold text-black flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5" />
          <div>
            <strong>Editorial Transparency & Methodology:</strong> Historical records vary by source, weather station, timezone, and chart region. Some values are reconstructed estimates rather than direct observations. Missing or partial data is reported honestly rather than invented.
          </div>
        </div>

        {/* Providers */}
        <div className="space-y-3.5 text-xs font-heading">
          <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-1.5">
            <div className="flex items-center justify-between font-heading font-black text-sm text-black">
              <span className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-blue-600" />
                Historical Weather & Climate Reanalysis
              </span>
              <span className="px-2 py-0.5 bg-[#00C2FF] text-black border border-black rounded-md text-[10px]">Open-Meteo ERA5</span>
            </div>
            <p className="text-neutral-700">
              Reconstructed via <strong>Open-Meteo Historical Archive API</strong>, powered by ECMWF ERA5 reanalysis and national weather stations (NOAA, UK Met Office, IMD, DWD). Covers high/mean/low temperatures, precipitation mm, wind speeds, and solar daylight arcs.
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-1.5">
            <div className="flex items-center justify-between font-heading font-black text-sm text-black">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Historical Dispatches & Global News
              </span>
              <span className="px-2 py-0.5 bg-[#CCFF00] text-black border border-black rounded-md text-[10px]">Wikimedia REST API</span>
            </div>
            <p className="text-neutral-700">
              News headlines and milestones are retrieved dynamically from the official <strong>Wikipedia / Wikimedia Foundation "On This Day" API</strong>, citing historical treaty registries, summits, and archives with direct article hyperlinks.
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-1.5">
            <div className="flex items-center justify-between font-heading font-black text-sm text-black">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                Astronomical Moon Phase & Solar Ephemeris
              </span>
              <span className="px-2 py-0.5 bg-[#FF66C4] text-black border border-black rounded-md text-[10px]">Jean Meeus Ephemeris</span>
            </div>
            <p className="text-neutral-700">
              Moon illumination percentages and synodic lunar ages are computed using validated <strong>Jean Meeus Astronomical Algorithms</strong> calibrated to NASA/JPL Horizons ephemeris benchmarks (±0.5% precision).
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-1.5">
            <div className="flex items-center justify-between font-heading font-black text-sm text-black">
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-pink-600" />
                Music Charts & Cinema Blockbusters
              </span>
              <span className="px-2 py-0.5 bg-[#FFE600] text-black border border-black rounded-md text-[10px]">Billboard & Box Office Mojo</span>
            </div>
            <p className="text-neutral-700">
              #1 singles are matched to exact historical <strong>Billboard Hot 100</strong> and UK Official Singles weekly chart runs. Box office champions cite <strong>Box Office Mojo</strong> and <em>The Numbers</em> annual worldwide rankings.
            </p>
          </div>

          <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-1.5">
            <div className="flex items-center justify-between font-heading font-black text-sm text-black">
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Cost of Living, Inflation & Purchasing Power
              </span>
              <span className="px-2 py-0.5 bg-[#22C55E] text-black border border-black rounded-md text-[10px]">BLS CPI-U & FRED</span>
            </div>
            <p className="text-neutral-700">
              Inflation adjustments cite the <strong>U.S. Bureau of Labor Statistics (BLS) Consumer Price Index (CPI-U)</strong> series (1913–2026). Gold prices cite London Bullion Market Association (LBMA) PM fixes; energy prices cite U.S. EIA weekly surveys.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FFE600] hover:bg-[#CCFF00] text-black font-heading font-black text-xs uppercase tracking-wider border-2 border-black rounded-xl shadow-neo-xs transition-all cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
