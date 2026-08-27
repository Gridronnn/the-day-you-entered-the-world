import React from 'react';
import { DayDataPayload } from '../../types/history';
import { CurrencyCode, formatPrice, CURRENCIES } from '../../services/currencyEngine';
import { DollarSign, Sparkles, Fuel, Wheat, Coffee, Film, Home, Car, Cpu, TrendingUp } from 'lucide-react';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  LilacSparkleDecal,
  NeoBadge,
} from '../common/NeoStickers';

export const CostOfLivingSection: React.FC<{
  data: DayDataPayload;
  selectedCurrency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
}> = ({ data, selectedCurrency, onChangeCurrency }) => {
  const { costOfLiving, input } = data;
  const [year] = input.birthDate.split('-').map(Number);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#FFE600]" />;
      case 'Fuel':
        return <Fuel className="w-5 h-5 text-[#FF7A00]" />;
      case 'Wheat':
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
                ECONOMIC ARCHIVE & PURCHASING POWER
              </span>
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
              A dollar in {year} held the approximate purchasing power of {formatPrice(costOfLiving.inflationMultiplier, selectedCurrency)} today.
            </p>
          </div>
        </div>
        <div className="bg-white text-black font-heading font-bold text-xs px-3 py-1.5 border-2 border-black rounded-lg shadow-neo-xs">
          Values calibrated for {year}
        </div>
      </div>

      {/* 8 Saturated Price Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {costItems.map((item) => (
          <div
            key={item.name}
            className="neo-card p-5 bg-white space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-black border-2 border-black rounded-xl flex items-center justify-center shadow-neo-xs">
                  {renderIcon(item.iconName)}
                </div>
                <span className="bg-[#FFFDF0] text-neutral-700 font-heading font-bold text-[10px] uppercase px-2 py-0.5 border border-black rounded">
                  {item.unit}
                </span>
              </div>

              <h3 className="font-display font-black text-base text-black leading-snug">
                {item.name}
              </h3>
            </div>

            {/* Price Compare */}
            <div className="space-y-1.5 bg-[#FFFDF0] p-3 border-2 border-black rounded-xl">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-heading font-black text-neutral-500 uppercase">
                  THEN ({year}):
                </span>
                <span className="font-display font-black text-xl text-black">
                  {formatPrice(item.historicalValueUsd, selectedCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-t border-neutral-300 pt-1">
                <span className="text-[10px] font-heading font-bold text-neutral-500 uppercase">
                  NOW (2026):
                </span>
                <span className="font-heading font-bold text-xs text-neutral-600">
                  {formatPrice(item.currentValueUsd, selectedCurrency)}
                </span>
              </div>
            </div>

            {item.funFact && (
              <p className="text-[11px] font-heading font-semibold text-neutral-600 italic">
                {item.funFact}
              </p>
            )}
          </div>
        ))}
      </div>

    </section>
  );
};
