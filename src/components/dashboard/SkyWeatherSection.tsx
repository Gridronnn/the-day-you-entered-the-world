import React, { useState } from 'react';
import { DayDataPayload } from '../../types/history';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Sunrise, Sunset, Info } from 'lucide-react';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  YellowSemicircleDecal,
  LilacSparkleDecal,
  NeoBadge,
} from '../common/NeoStickers';

export const SkyWeatherSection: React.FC<{ data: DayDataPayload }> = ({ data }) => {
  const { weather, input } = data;
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const displayTemp = unit === 'C' ? `${weather.tempC}°C` : `${weather.tempF}°F`;

  const getWeatherIcon = () => {
    switch (weather.conditionCode) {
      case 'rain':
        return <CloudRain className="w-12 h-12 text-[#2563EB]" />;
      case 'snow':
        return <Snowflake className="w-12 h-12 text-[#00F5FF]" />;
      case 'cloudy':
      case 'partly_cloudy':
        return <Cloud className="w-12 h-12 text-neutral-700" />;
      default:
        return <Sun className="w-12 h-12 text-[#FF7A00] animate-spin-slow" />;
    }
  };

  return (
    <section id="sec-sky" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFE600] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-black rotate-[-2deg]">
            3
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#22C55E] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                METEOROLOGY & CELESTIAL CLIMATE
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              The Sky Above You
            </h2>
          </div>
        </div>

        {/* Unit Toggle (°C / °F) */}
        <div className="flex items-center bg-white border-3 border-black rounded-xl shadow-neo p-1 gap-1">
          <button
            type="button"
            onClick={() => setUnit('C')}
            className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
              unit === 'C' ? 'bg-[#FFE600] text-black border-2 border-black shadow-neo-xs' : 'text-neutral-500 hover:text-black'
            }`}
          >
            °C (Celsius)
          </button>
          <button
            type="button"
            onClick={() => setUnit('F')}
            className={`px-3 py-1 text-xs font-heading font-black rounded-lg transition-all ${
              unit === 'F' ? 'bg-[#FFE600] text-black border-2 border-black shadow-neo-xs' : 'text-neutral-500 hover:text-black'
            }`}
          >
            °F (Fahrenheit)
          </button>
        </div>
      </div>

      {/* Main Weather Visual Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Primary Temperature & Conditions */}
        <div className="lg:col-span-7 neo-card p-6 sm:p-8 bg-[#00F5FF] space-y-6 relative overflow-hidden">
          <div className="absolute top-3 right-4 opacity-30 pointer-events-none">
            <YellowSemicircleDecal size={90} className="rotate-90" />
          </div>

          <div className="flex items-center justify-between">
            <span className="bg-white text-black font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs">
              📍 {input.birthCity.toUpperCase()} ON {input.birthDate}
            </span>
            <span className="bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs">
              RECONSTRUCTED
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
            <div>
              <div className="font-display font-black text-6xl sm:text-7xl text-black tracking-tight leading-none">
                {displayTemp}
              </div>
              <div className="font-heading font-black text-xl text-black mt-2">
                {weather.condition}
              </div>
            </div>
            <div className="w-24 h-24 bg-white border-3 border-black rounded-3xl shadow-neo flex items-center justify-center">
              {getWeatherIcon()}
            </div>
          </div>

          <p className="font-heading font-semibold text-sm text-black/90 bg-white/80 p-3.5 border-2 border-black rounded-xl leading-relaxed">
            {weather.seasonNote}
          </p>

          {/* Meteorological Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-heading font-black text-neutral-500 uppercase">
                <Droplets className="w-3.5 h-3.5 text-[#2563EB]" /> Humidity
              </div>
              <div className="font-display font-black text-lg text-black mt-0.5">
                {weather.humidity}%
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-heading font-black text-neutral-500 uppercase">
                <Wind className="w-3.5 h-3.5 text-[#00F5FF]" /> Wind Speed
              </div>
              <div className="font-display font-black text-lg text-black mt-0.5">
                {weather.windSpeedKmh} km/h
              </div>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-3 shadow-neo-xs col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] font-heading font-black text-neutral-500 uppercase">
                <Sun className="w-3.5 h-3.5 text-[#FF7A00]" /> Daylight Span
              </div>
              <div className="font-display font-black text-lg text-black mt-0.5">
                {weather.dayLength}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Solar Arc (Sunrise & Sunset) */}
        <div className="lg:col-span-5 neo-card p-6 sm:p-8 bg-[#FFFDF0] space-y-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <span className="text-xs font-heading font-black uppercase tracking-wider text-black">
              SOLAR CYCLE
            </span>
            <span className="bg-[#FFE600] text-black font-heading font-black text-xs px-2 py-0.5 border border-black rounded shadow-neo-xs">
              DAYLIGHT ARC
            </span>
          </div>

          {/* Sunrise / Sunset Arch Graphic */}
          <div className="space-y-4 py-2">
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-neo-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center">
                    <Sunrise className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-[10px] font-heading font-black text-neutral-500 uppercase">
                      FIRST LIGHT / SUNRISE
                    </div>
                    <div className="font-display font-black text-lg text-black">
                      {weather.sunrise}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-0.5 bg-neutral-200 border-t border-dashed border-black/30 my-2" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-[#FF4D8D] border-2 border-black rounded-xl flex items-center justify-center text-white">
                    <Sunset className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-heading font-black text-neutral-500 uppercase">
                      TWILIGHT / SUNSET
                    </div>
                    <div className="font-display font-black text-lg text-black">
                      {weather.sunset}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Graceful Meteorological Disclosure */}
          <div className="bg-[#FFE600]/30 border-2 border-black rounded-xl p-3 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <p className="text-[11px] font-heading font-semibold text-neutral-800 leading-snug">
              Historical weather is reconstructed from global meteorological archives and seasonal solar equations. Microclimates and localized records may vary.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
