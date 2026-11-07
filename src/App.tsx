import React, { useState } from 'react';
import { LandingHero } from './components/hero/LandingHero';
import { TimeTravelSequence } from './components/portal/TimeTravelSequence';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { ArrivalSection } from './components/dashboard/ArrivalSection';
import { WorldNewsSection } from './components/dashboard/WorldNewsSection';
import { SkyWeatherSection } from './components/dashboard/SkyWeatherSection';
import { CostOfLivingSection } from './components/dashboard/CostOfLivingSection';
import { PopCultureSection } from './components/dashboard/PopCultureSection';
import { UpliftingSection } from './components/dashboard/UpliftingSection';
import { ThenVsNowSection } from './components/dashboard/ThenVsNowSection';
import { MemoryCardSection } from './components/dashboard/MemoryCardSection';
import { AudioFloatingWidget } from './components/common/AudioFloatingWidget';
import { DataTransparencyModal } from './components/common/DataTransparencyModal';
import { DayDataPayload, UserBirthInput } from './types/history';
import { generateDayData } from './services/historicalDatabase';
import { fetchLiveStoryData } from './services/storyApiClient';
import { CurrencyCode, calculateCostOfLiving } from './services/currencyEngine';
import { audioEngine } from './services/audioEngine';
import { Info, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [viewState, setViewState] = useState<'hero' | 'travel' | 'dashboard'>('hero');
  const [currentPayload, setCurrentPayload] = useState<DayDataPayload | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isTransparencyOpen, setIsTransparencyOpen] = useState<boolean>(false);

  const handleStartJourney = (input: UserBirthInput) => {
    // 1. Initial verified offline payload to start travel sequence instantly
    const initialPayload = generateDayData(input, selectedCurrency);
    setCurrentPayload(initialPayload);
    setViewState('travel');

    // 2. Fetch live data from Open-Meteo, Wikimedia, ECB, and country-aware economic series
    fetchLiveStoryData(input, selectedCurrency)
      .then((livePayload) => {
        setCurrentPayload(livePayload);
      })
      .catch((err) => {
        console.warn('Live API resolution fallback to verified archive:', err);
      });
  };

  const handleChangeCurrency = (newCurrency: CurrencyCode) => {
    setSelectedCurrency(newCurrency);
    if (currentPayload) {
      const [year] = currentPayload.input.birthDate.split('-').map(Number);
      const updatedCosts = calculateCostOfLiving(year, newCurrency, currentPayload.input.birthCity);
      setCurrentPayload({
        ...currentPayload,
        costOfLiving: updatedCosts,
      });

      // Also refresh live economics from API with the new currency
      fetchLiveStoryData(currentPayload.input, newCurrency)
        .then((fresh) => {
          setCurrentPayload(fresh);
        })
        .catch(() => {});
    }
  };

  const handleTravelComplete = () => {
    setViewState('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setViewState('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAudio = () => {
    const playing = audioEngine.toggleAmbient();
    setIsAudioPlaying(playing);
  };

  const targetYear = currentPayload
    ? Number(currentPayload.input.birthDate.split('-')[0])
    : 1995;

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-black font-sans selection:bg-[#FFE600] selection:text-black">
      
      {/* 1. Landing Hero Screen */}
      {viewState === 'hero' && (
        <LandingHero
          onStartJourney={handleStartJourney}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* 2. Animated Time-Travel Sequence */}
      {viewState === 'travel' && currentPayload && (
        <TimeTravelSequence
          targetYear={targetYear}
          birthDate={currentPayload.input.birthDate}
          birthCity={currentPayload.input.birthCity}
          onComplete={handleTravelComplete}
        />
      )}

      {/* 3. Main Dashboard Screen */}
      {viewState === 'dashboard' && currentPayload && (
        <div className="min-h-screen flex flex-col bg-[#FFFDF0]">
          {/* Sticky Header Nav */}
          <DashboardHeader
            data={currentPayload}
            selectedCurrency={selectedCurrency}
            onChangeCurrency={handleChangeCurrency}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onReset={handleReset}
            onOpenTransparency={() => setIsTransparencyOpen(true)}
          />

          {/* Dashboard Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 w-full flex-1">
            {/* Section 1: Your Arrival */}
            <ArrivalSection data={currentPayload} />

            {/* Section 2: The World That Day */}
            <WorldNewsSection
              data={currentPayload}
              onOpenTransparency={() => setIsTransparencyOpen(true)}
            />

            {/* Section 3: The Sky Above You */}
            <SkyWeatherSection
              data={currentPayload}
              onOpenTransparency={() => setIsTransparencyOpen(true)}
            />

            {/* Section 4: What Life Cost */}
            <CostOfLivingSection
              data={currentPayload}
              selectedCurrency={selectedCurrency}
              onChangeCurrency={handleChangeCurrency}
              onOpenTransparency={() => setIsTransparencyOpen(true)}
            />

            {/* Section 5: What Everyone Loved */}
            <PopCultureSection data={currentPayload} />

            {/* Section 6: Good Things Happened */}
            <UpliftingSection data={currentPayload} />

            {/* Section 7: Then vs Now */}
            <ThenVsNowSection
              data={currentPayload}
              onOpenTransparency={() => setIsTransparencyOpen(true)}
            />

            {/* Section 8: Your Birth Day Story */}
            <MemoryCardSection data={currentPayload} />

            {/* Historical Data & Regional Variance Transparency Banner */}
            <div className="bg-[#FFE600] border-4 border-black rounded-3xl p-6 sm:p-8 shadow-neo-lg space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-black text-[#FFE600] rounded-xl flex items-center justify-center font-black">
                    <ShieldCheck className="w-5 h-5 text-[#FFE600]" />
                  </div>
                  <h3 className="font-display font-black text-xl text-black uppercase">
                    Data Integrity & Sourced Methodology
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsTransparencyOpen(true)}
                  className="px-3.5 py-1.5 bg-black text-[#FFE600] hover:bg-neutral-800 text-xs font-heading font-black uppercase rounded-xl border border-black shadow-neo-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                >
                  <Info className="w-3.5 h-3.5" /> Full Sourced Audit
                </button>
              </div>

              <p className="font-heading font-semibold text-xs sm:text-sm text-black/90 leading-relaxed">
                Facts on this dashboard are drawn from verified public statistical archives and scientific models. Atmospheric weather is reconstructed from the ECMWF ERA5 global reanalysis grid via Open-Meteo. Economic prices are sourced from official national series (Reserve Bank of India, PPAC, and U.S. BLS / EIA). World headlines are pulled from the Wikimedia Foundation "On This Day" registry. No data points are fabricated or artificially simulated.
              </p>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-black text-[#FFE600] py-8 border-t-4 border-black font-heading mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="font-display font-black text-xl text-white uppercase">
                  The Day You Entered The World
                </div>
                <div className="text-xs font-semibold text-neutral-400">
                  A Neo-Brutalist Time Travel Journey • Verified Sourced Data Architecture
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransparencyOpen(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-[#FFE600] text-xs font-heading font-bold px-3 py-2 border border-neutral-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" /> Data Audit
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-4 py-2 border-2 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  Explore Another Date 🚀
                </button>
              </div>
            </div>
          </footer>

          {/* Floating Audio Controller */}
          <AudioFloatingWidget
            isPlaying={isAudioPlaying}
            onToggle={handleToggleAudio}
          />

          {/* Transparency Audit Modal */}
          <DataTransparencyModal
            isOpen={isTransparencyOpen}
            onClose={() => setIsTransparencyOpen(false)}
          />
        </div>
      )}

    </div>
  );
};

export default App;
