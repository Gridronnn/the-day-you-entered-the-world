import React from 'react';
import { X, ShieldCheck, Database, ExternalLink, Key, AlertCircle, Clock } from 'lucide-react';

interface DataTransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataTransparencyModal: React.FC<DataTransparencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFDF0] border-4 border-black rounded-3xl shadow-neo-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-[#FFE600] border-b-4 border-black p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-[#FFE600] rounded-xl border-2 border-black flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6 text-[#FFE600]" />
            </div>
            <div>
              <span className="bg-black text-white text-[10px] font-heading font-black uppercase px-2 py-0.5 rounded">
                DATA INTEGRITY & FRESHNESS AUDIT
              </span>
              <h2 id="modal-title" className="font-display font-black text-2xl text-black uppercase tracking-tight">
                Data Sources & Transparency
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 bg-white hover:bg-neutral-100 text-black border-2 border-black rounded-xl shadow-neo-xs flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-black stroke-[3]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-black">
          {/* 1. Status Vocabulary */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-black" /> Status Vocabulary & Meaning
            </h3>
            <p className="font-heading font-semibold text-xs text-neutral-700">
              Every data point displays an explicit freshness status so you know whether a number is live, delayed, historical, or modeled:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs space-y-1">
                <span className="bg-[#CCFF00] text-black font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  HISTORICAL
                </span>
                <p className="text-xs font-heading font-semibold text-neutral-800">
                  Static record verified for that past date (e.g. 1995 LBMA gold fix, 2002 PPAC fuel price).
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs space-y-1">
                <span className="bg-[#FFE600] text-black font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  DELAYED
                </span>
                <p className="text-xs font-heading font-semibold text-neutral-800">
                  Official published benchmark (e.g. ECB daily reference rate, weekly EIA gasoline, monthly BLS CPI).
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs space-y-1">
                <span className="bg-[#00F5FF] text-black font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  MODELED
                </span>
                <p className="text-xs font-heading font-semibold text-neutral-800">
                  Scientific numerical reanalysis (e.g. Open-Meteo ECMWF ERA5 gridded atmospheric reanalysis).
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs space-y-1">
                <span className="bg-[#C084FC] text-black font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  CALCULATED
                </span>
                <p className="text-xs font-heading font-semibold text-neutral-800">
                  Deterministic mathematical derivation (e.g. Meeus astronomical moon ephemeris, inflation multiplier).
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs space-y-1">
                <span className="bg-[#22C55E] text-black font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  LIVE
                </span>
                <p className="text-xs font-heading font-semibold text-neutral-800">
                  Streaming market feed observed within minutes (enabled when server-side market keys are configured).
                </p>
              </div>

              <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs space-y-1">
                <span className="bg-neutral-200 text-neutral-800 font-heading font-black text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  UNAVAILABLE
                </span>
                <p className="text-xs font-heading font-semibold text-neutral-800">
                  Honest disclosure when the archive has no verified record for that exact date, rather than fabricating data.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Official Sourced Providers Table */}
          <div className="space-y-3">
            <h3 className="font-display font-black text-lg uppercase tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-black" /> Verified Data Providers
            </h3>
            <div className="border-3 border-black rounded-2xl overflow-hidden shadow-neo-sm bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#FFFDF0] border-b-2 border-black font-heading font-black text-[11px] uppercase">
                  <tr>
                    <th className="p-3 border-r-2 border-black">Fact / Metric</th>
                    <th className="p-3 border-r-2 border-black">Provider & Source</th>
                    <th className="p-3 border-r-2 border-black">Geography</th>
                    <th className="p-3">Update Cadence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20 font-heading font-semibold">
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Historical Weather</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://open-meteo.com/en/docs/historical-weather-api" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        Open-Meteo ERA5 / ECMWF <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">Global (0.25° Grid)</td>
                    <td className="p-3">Static reanalysis archive</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">World Headlines</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://en.wikipedia.org/api/rest_v1/feed/onthisday/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        Wikimedia Foundation REST API <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">Global</td>
                    <td className="p-3">Static archive</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Gold (India / INR)</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://rbi.org.in/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        RBI & World Gold Council <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">India (₹ per 10g 24K)</td>
                    <td className="p-3">Historical fix / Daily IBJA</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Petrol (India / INR)</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://www.ppac.gov.in/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        Petroleum Planning & Analysis Cell (PPAC) <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">India (₹ per Litre)</td>
                    <td className="p-3">Official tariff revisions</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Gasoline (U.S. / USD)</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://www.eia.gov/petroleum/gasdiesel/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        U.S. Energy Information Admin (EIA) <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">U.S. ($ per Gallon)</td>
                    <td className="p-3">Weekly survey (Mondays)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Staple Bread & Milk</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        U.S. BLS & Indian MoSPI / NDDB <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">U.S. / India</td>
                    <td className="p-3">Monthly / Periodic survey</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Forex Reference Rates</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://www.ecb.europa.eu/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        European Central Bank via Frankfurter <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">Major Currencies</td>
                    <td className="p-3">Daily ECB reference fix (~16:00 CET)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-r-2 border-black font-bold">Demographics & Longevity</td>
                    <td className="p-3 border-r-2 border-black">
                      <a href="https://population.un.org/wpp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600 inline-flex items-center gap-1 font-bold">
                        UN Population Division (WPP 2024) & WHO <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-3 border-r-2 border-black">Global</td>
                    <td className="p-3">Biennial revision</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Server Configuration & Optional Keys */}
          <div className="bg-[#FFFDF0] border-3 border-black rounded-2xl p-4 shadow-neo-sm space-y-3">
            <h3 className="font-display font-black text-base uppercase tracking-tight flex items-center gap-2">
              <Key className="w-4 h-4 text-black" /> Optional Server Credentials & Environment Variables
            </h3>
            <p className="text-xs font-heading font-semibold text-neutral-700 leading-relaxed">
              This application is built to run <strong>100% out of the box</strong> using free public endpoints (Open-Meteo, Wikimedia, ECB Frankfurter) and verified central bank archives without requiring API keys. If you want real-time live streaming feeds, you can configure these environment variables in your Vercel project settings:
            </p>
            <div className="bg-black text-[#FFE600] font-mono text-[11px] p-3 rounded-xl border border-black space-y-1">
              <div># Optional live streaming feeds</div>
              <div>GOLDAPI_KEY=your_key_here     # Real-time gold spot feed (goldapi.io)</div>
              <div>EIA_API_KEY=your_key_here     # Live weekly U.S. gas survey (eia.gov)</div>
              <div>BLS_API_KEY=your_key_here     # Monthly U.S. CPI updates (bls.gov)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t-4 border-black p-4 flex items-center justify-between">
          <span className="text-[11px] font-heading font-bold text-neutral-600">
            Open & Verifiable Data Architecture • Zero Fabricated Records
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#FFE600] text-black font-display font-black text-xs uppercase border-2 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
