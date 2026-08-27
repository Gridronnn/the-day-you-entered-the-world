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
import { DayDataPayload, UserBirthInput } from './types/history';
import { generateDayData } from './services/historicalDatabase';
import { fetchVerifiedHistoricalNews } from './services/wikipediaNewsService';
import { CurrencyCode } from './services/currencyEngine';
import { audioEngine } from './services/audioEngine';
import { AlertTriangle, Info, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [viewState, setViewState] = useState<'hero' | 'travel' | 'dashboard'>('hero');
  const [currentPayload, setCurrentPayload] = useState<DayDataPayload | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const handleStartJourney = async (input: UserBirthInput) => {
    // 1. Instant robust synchronous base generation
    const payload = generateDayData(input);
    setCurrentPayload(payload);
    setViewState('travel');

    // 2. Background live API query to Wikipedia REST API "On this day"
    try {
      const liveNews = await fetchVerifiedHistoricalNews(input.birthDate);
      if (liveNews && liveNews.length > 0) {
        setCurrentPayload((prev) => {
          if (!prev) return payload;
          return {
            ...prev,
            worldNews: liveNews,
          };
        });
      }
    } catch (e) {
      // Graceful fallback already populated
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
            onChangeCurrency={setSelectedCurrency}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onReset={handleReset}
          />

          {/* Dashboard Container */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 w-full flex-1">
            {/* Section 1: Your Arrival */}
            <ArrivalSection data={currentPayload} />

            {/* Section 2: The World That Day */}
            <WorldNewsSection data={currentPayload} />

            {/* Section 3: The Sky Above You */}
            <SkyWeatherSection data={currentPayload} />

            {/* Section 4: What Life Cost */}
            <CostOfLivingSection
              data={currentPayload}
              selectedCurrency={selectedCurrency}
              onChangeCurrency={setSelectedCurrency}
            />

            {/* Section 5: What Everyone Loved */}
            <PopCultureSection data={currentPayload} />

            {/* Section 6: Good Things Happened */}
            <UpliftingSection data={currentPayload} />

            {/* Section 7: Then vs Now */}
            <ThenVsNowSection data={currentPayload} />

            {/* Section 8: Your Birth Day Story */}
            <MemoryCardSection data={currentPayload} />

            {/* Historical Data & Regional Variance Transparency Note */}
            <div className="bg-[#FFE600] border-4 border-black rounded-3xl p-6 sm:p-8 shadow-neo-lg space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-black text-[#FFE600] rounded-xl flex items-center justify-center font-black">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="font-display font-black text-xl text-black uppercase">
                  Note on Historical Archives & Methodology
                </h3>
              </div>
              <p className="font-heading font-semibold text-xs sm:text-sm text-black/90 leading-relaxed">
                Historical news, prices, and weather records may vary by country, region, and available documentation. Meteorological details are reconstructed from historical climate records and reanalysis archives. Commodity prices and purchasing power metrics represent national consumer price benchmarks converted for historical context. Celestial positions and lunar phases are calculated using high-precision astronomical algorithms (Jean Meeus ephemeris).
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
                  A Neo-Brutalist Time Travel Journey • 1930 to Present
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-4 py-2.5 border-2 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
              >
                Explore Another Date 🚀
              </button>
            </div>
          </footer>

          {/* Floating Audio Controller */}
          <AudioFloatingWidget
            isPlaying={isAudioPlaying}
            onToggle={handleToggleAudio}
          />
        </div>
      )}

    </div>
  );
};

export default App;

