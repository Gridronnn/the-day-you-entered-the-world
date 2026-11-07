import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowLeft, Volume2, VolumeX, DollarSign, Calendar, MapPin, Share2, Compass, ChevronDown, Check, ShieldCheck } from 'lucide-react';
import { CurrencyCode, CURRENCIES } from '../../services/currencyEngine';
import { DayDataPayload } from '../../types/history';
import { audioEngine } from '../../services/audioEngine';

interface DashboardHeaderProps {
  data: DayDataPayload;
  selectedCurrency: CurrencyCode;
  onChangeCurrency: (c: CurrencyCode) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onReset: () => void;
  onOpenTransparency?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  data,
  selectedCurrency,
  onChangeCurrency,
  isAudioPlaying,
  onToggleAudio,
  onReset,
  onOpenTransparency,
}) => {
  const [activeTab, setActiveTab] = useState<string>('sec-arrival');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const activeCurrencyConfig = CURRENCIES[selectedCurrency] || CURRENCIES.USD;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCurrencyOpen(false);
    };

    if (isCurrencyOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCurrencyOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTabClick = (id: string) => {
    if (activeTab !== id) {
      audioEngine.playTabClick();
      setActiveTab(id);
    }
    scrollToSection(id);
  };

  const handleSelectCurrency = (code: CurrencyCode) => {
    onChangeCurrency(code);
    setIsCurrencyOpen(false);
    audioEngine.playTabClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF0] border-b-4 border-black px-4 sm:px-6 py-3 shadow-neo-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Back button & Origin Stamp */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            onClick={onReset}
            className="neo-button-white text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Choose a different date or city"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-heading font-black">NEW DATE</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-[#FFE600] border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-xs font-heading font-black text-xs text-black flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-black" />
              <span>{data.input.birthDate}</span>
            </div>
            <div className="bg-[#00F5FF] border-2 border-black px-2.5 py-1 rounded-lg shadow-neo-xs font-heading font-bold text-xs text-black hidden sm:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span>{data.input.birthCity}</span>
            </div>
          </div>
        </div>

        {/* Center: Quick Section Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
          {[
            { id: 'sec-arrival', label: '1. Arrival' },
            { id: 'sec-world', label: '2. The World' },
            { id: 'sec-sky', label: '3. Sky & Weather' },
            { id: 'sec-costs', label: '4. Life Cost' },
            { id: 'sec-culture', label: '5. Pop Culture' },
            { id: 'sec-good', label: '6. Good News' },
            { id: 'sec-compare', label: '7. Then vs Now' },
            { id: 'sec-story', label: '8. Keepsake' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleTabClick(sec.id)}
              className="bg-white hover:bg-[#FFE600] text-black text-[11px] font-heading font-bold px-2.5 py-1 border-2 border-black rounded-lg shadow-neo-xs transition-all active:translate-y-0.5 whitespace-nowrap"
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Right: Currency & Audio Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Data Transparency Modal Trigger */}
          {onOpenTransparency && (
            <button
              type="button"
              onClick={onOpenTransparency}
              className="bg-[#22C55E] hover:bg-[#16a34a] text-black border-2 border-black rounded-lg px-2.5 py-1 font-heading font-black text-xs shadow-neo-xs flex items-center gap-1.5 transition-all active:translate-y-0.5 cursor-pointer"
              title="View Sourced Providers, Update Cadence & Freshness Audit"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOURCES</span>
            </button>
          )}

          {/* Compact Neo-Brutalist Currency Switcher */}
          <div className="relative inline-flex items-center" ref={currencyDropdownRef}>
            <span className="text-[10px] font-mono font-bold text-neutral-500 mr-1.5 hidden sm:inline select-none">
              CURRENCY:
            </span>
            <button
              type="button"
              onClick={() => setIsCurrencyOpen((prev) => !prev)}
              className="bg-white hover:bg-[#FFE600] text-black border-2 border-black rounded-lg px-2.5 py-1 font-heading font-black text-xs shadow-neo-xs flex items-center gap-1.5 transition-all active:translate-y-0.5"
              aria-haspopup="listbox"
              aria-expanded={isCurrencyOpen}
            >
              <span className="bg-[#FFE600] px-1 py-0.5 rounded border border-black text-[10px] leading-none font-black">
                {activeCurrencyConfig.symbol}
              </span>
              <span>{selectedCurrency}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-black transition-transform duration-150 ${
                  isCurrencyOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Compact 2-Column Floating Currency Popover */}
            {isCurrencyOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-white border-2 border-black rounded-xl shadow-neo p-1.5 z-50 w-52 sm:w-56 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-mono font-black text-neutral-500 uppercase px-2 py-0.5 border-b border-neutral-200 mb-1 flex items-center justify-between">
                  <span>SELECT CURRENCY</span>
                  <span className="text-[9px] bg-neutral-100 px-1 rounded font-bold">7 OPTIONS</span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                    const curr = CURRENCIES[code];
                    const isSelected = selectedCurrency === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelectCurrency(code)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-heading transition-all ${
                          isSelected
                            ? 'bg-[#FFE600] text-black font-black border-2 border-black shadow-neo-xs'
                            : 'hover:bg-neutral-100 text-neutral-800 font-bold border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span className="font-mono text-[11px] font-bold text-neutral-500">{curr.symbol}</span>
                          <span>{code}</span>
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Audio Toggle */}
          <button
            type="button"
            onClick={onToggleAudio}
            className="bg-[#C084FC] hover:bg-[#B75DFF] text-black text-xs font-heading font-bold px-2.5 py-1 border-2 border-black rounded-lg shadow-neo-xs flex items-center gap-1.5 transition-all"
            title="Toggle Ambient Audio"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-black animate-pulse" />
                <span className="hidden sm:inline">Music: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-black/70" />
                <span className="hidden sm:inline">Music: OFF</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

