import React from 'react';
import { DayDataPayload, FactStatus } from '../../types/history';
import { CurrencyCode, formatPrice, CURRENCIES } from '../../services/currencyEngine';
import { Sparkles, Fuel, Wheat, Coffee, Film, Home, Car, Cpu, ExternalLink, Info } from 'lucide-react';

export const CostOfLivingSection: React.FC<{
  data: DayDataPayload;
  selectedCurrency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  onOpenTransparency?: () => void;
}> = ({ data, selectedCurrency, onChangeCurrency, onOpenTransparency }) => {
  const { costOfLiving, input } = data;
  const [year] = input.birthDate.split('-').map(Number);
  const isIndia = selectedCurrency === 'INR' || input.birthCity.toLowerCase().includes('kerala') || input.birthCity.toLowerCase().includes('tamil') || input.birthCity.toLowerCase().includes('india') || input.birthCity.toLowerCase().includes('mumbai');

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
      case 'Coins':
        return <Sparkles className="w-5 h-5 text-[#FFE600]" />;
      case 'Fuel':
        return <Fuel className="w-5 h-5 text-[#FF7A00]" />;
      case 'Wheat':
      case 'Utensils':
        return <Wheat className="w-5 h-5 text-[#22C55E]" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#C084FC]" />;
      case 'Film':
        return <Film className="w-5 h-5 text-[#FF4D8D]" />;
      case 'Home':
        return <Home className="w-5 h-5 text-[#2563EB]" />;
      case 'Car':
        return <Car className="w-5 h-5 text-[#00F5FF]" />;
      default:
        return <Cpu className="w-5 h-5 text-[#CCFF00]" />;
    }
  };

  const renderStatusBadge = (status?: FactStatus) => {
    switch (status) {
      case 'live':
        return <span className="bg-[#22C55E] text-black font-heading font-black text-[9px] uppercase px-1.5 py-0.5 border border-black rounded shadow-neo-xs">LIVE</span>;
      case 'delayed':
        return <span className="bg-[#FFE600] text-black font-heading font-black text-[9px] uppercase px-1.5 py-0.5 border border-black rounded shadow-neo-xs">DELAYED BENCHMARK</span>;
      case 'modeled':
        return <span className="bg-[#00F5FF] text-black font-heading font-black text-[9px] uppercase px-1.5 py-0.5 border border-black rounded shadow-neo-xs">MODELED</span>;
      case 'unavailable':
        return <span className="bg-neutral-300 text-neutral-800 font-heading font-black text-[9px] uppercase px-1.5 py-0.5 border border-black rounded">UNAVAILABLE</span>;
      default:
        return <span className="bg-[#CCFF00] text-black font-heading font-black text-[9px] uppercase px-1.5 py-0.5 border border-black rounded shadow-neo-xs">HISTORICAL RECORD</span>;
    }
  };

  const costItems = [
    costOfLiving.goldOz,
    costOfLiving.petrolGallon,
    costOfLiving.bread,
    costOfLiving.milk,
    costOfLiving.movieTicket,
    costOfLiving.averageHome,
    costOfLiving.familyCar,
    costOfLiving.iconicTech,
  ];

  return (
    <section id="sec-costs" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF4D8D] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-white rotate-[3deg]">
            4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                VERIFIABLE ECONOMIC ARCHIVE
              </span>
              {onOpenTransparency && (
                <button
                  type="button"
                  onClick={onOpenTransparency}
                  className="bg-black text-[#FFE600] hover:bg-neutral-800 text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Info className="w-3 h-3" /> Data Sources
                </button>
              )}
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              What Life Cost
            </h2>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-black uppercase text-black hidden sm:inline">
            SELECT CURRENCY:
          </span>
          <div className="flex flex-wrap gap-1 bg-white border-3 border-black p-1 rounded-xl shadow-neo">
            {(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as CurrencyCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onChangeCurrency(code)}
                className={`px-2.5 py-1 text-xs font-heading font-black rounded-lg transition-all ${
                  selectedCurrency === code
                    ? 'bg-[#FFE600] text-black border-2 border-black shadow-neo-xs'
                    : 'text-neutral-600 hover:text-black'
                }`}
              >
                {CURRENCIES[code].symbol} {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inflation Factor Callout Banner */}
      <div className="bg-[#CCFF00] border-4 border-black shadow-neo rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center font-display font-black text-xl">
            📈
          </div>
          <div>
            <div className="font-display font-black text-lg text-black uppercase">
              Inflation Multiplier: ~{costOfLiving.inflationMultiplier}x
            </div>
            <p className="font-heading font-semibold text-xs text-neutral-800">
              {isIndia
                ? `Based on ${costOfLiving.cpiSeriesName || 'Reserve Bank of India (RBI) / MoSPI All-India Consumer Price Index'}. Purchasing power evolved significantly since ${year}.`
                : `Based on ${costOfLiving.cpiSeriesName || 'U.S. Bureau of Labor Statistics CPI-U (1982-84 = 100)'}. A dollar in ${year} held ~${costOfLiving.inflationMultiplier}x today's purchasing power.`}
            </p>
          </div>
        </div>
        <div className="bg-white text-black font-heading font-bold text-xs px-3 py-1.5 border-2 border-black rounded-lg shadow-neo-xs text-center md:text-right">
          <div>Geographic Basis: {isIndia ? '🇮🇳 India (RBI/PPAC)' : '🇺🇸 U.S. / Global (BLS/EIA)'}</div>
          <div className="text-[10px] text-neutral-500 font-mono">Calibrated for {year}</div>
        </div>
      </div>

      {/* 8 Saturated Price Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {costItems.map((item) => {
          const thenPrice = item.displayFormattedThen || formatPrice(item.historicalValueUsd, selectedCurrency);
          const nowPrice = item.displayFormattedNow || formatPrice(item.currentValueUsd, selectedCurrency);

          return (
            <div
              key={item.name}
              className="neo-card p-5 bg-white space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform border-3 border-black"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-black border-2 border-black rounded-xl flex items-center justify-center shadow-neo-xs">
                    {renderIcon(item.iconName)}
                  </div>
                  {renderStatusBadge(item.status)}
                </div>

                <div>
                  <h3 className="font-display font-black text-base text-black leading-snug">
                    {item.name}
                  </h3>
                  {item.geography && (
                    <div className="text-[10px] font-heading font-bold text-neutral-600 mt-0.5">
                      📍 {item.geography}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Compare */}
              <div className="space-y-2 bg-[#FFFDF0] p-3 border-2 border-black rounded-xl">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] font-heading font-black text-neutral-500 uppercase block">
                      THEN ({item.observedAt || year}):
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      {item.unit}
                    </span>
                  </div>
                  <span className="font-display font-black text-xl text-black">
                    {thenPrice}
                  </span>
                </div>

                <div className="flex justify-between items-baseline border-t border-dashed border-neutral-300 pt-1.5">
                  <div>
                    <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase block">
                      LATEST AVAILABLE:
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">
                      {item.publishedAt ? `Refreshed ${item.publishedAt}` : 'Official benchmark'}
                    </span>
                  </div>
                  <span className="font-heading font-black text-sm text-[#2563EB]">
                    {nowPrice}
                  </span>
                </div>
              </div>

              {/* Sourced Citation & Link */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-200">
                {item.sourceName && (
                  <div className="text-[10px] font-heading font-bold text-neutral-600 flex items-center justify-between">
                    <span className="truncate max-w-[170px]" title={item.sourceName}>
                      Src: {item.sourceName}
                    </span>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-blue-600 transition-colors shrink-0"
                        title="View official provider source"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
                {item.methodology && (
                  <p className="text-[9.5px] font-heading text-neutral-500 leading-tight">
                    {item.methodology}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
