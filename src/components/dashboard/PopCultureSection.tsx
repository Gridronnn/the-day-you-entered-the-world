import React, { useState } from 'react';
import { DayDataPayload } from '../../types/history';
import { Music, Film, Tv, Sparkles, Volume2, Play, CheckCircle, Tag, Gamepad2 } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  OrangeWavyBlobDecal,
  LilacSparkleDecal,
  NeoBadge,
} from '../common/NeoStickers';

export const PopCultureSection: React.FC<{ data: DayDataPayload }> = ({ data }) => {
  const { popCulture, input } = data;
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);

  const handlePlayMelody = () => {
    if (popCulture.billboardSong.melodyNotes && popCulture.billboardSong.melodyNotes.length > 0) {
      setIsPlayingMelody(true);
      audioEngine.playMelodySequence(popCulture.billboardSong.melodyNotes, () => {
        setIsPlayingMelody(false);
      });
    } else {
      audioEngine.playConfettiFanfare();
    }
  };

  return (
    <section id="sec-culture" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#C084FC] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-black rotate-[-3deg]">
            5
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                SOUNDTRACK, CINEMA & CRAZES
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              What Everyone Loved
            </h2>
          </div>
        </div>

        <PinkZigzagDecal size={64} className="hidden sm:block" />
      </div>

      {/* Top 2 Cards: Billboard #1 Song + #1 Box Office Movie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Billboard #1 Song with Interactive Audio Previewer */}
        <div className="lg:col-span-6 neo-card p-6 sm:p-8 bg-[#FFE600] space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-black text-[#FFE600] font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" /> BILLBOARD NO. 1 HIT
              </span>
              <span className="bg-white text-black font-heading font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-neo-xs">
                {popCulture.billboardSong.weeksAtNo1} WEEKS AT #1
              </span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-black leading-tight">
              {popCulture.billboardSong.title}
            </h3>
            <div className="font-heading font-black text-lg text-black/90">
              by {popCulture.billboardSong.artist}
            </div>

            {/* Lyrics snippet */}
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-neo-xs font-heading font-semibold text-sm text-black italic">
              "{popCulture.billboardSong.lyricsSnippet}"
            </div>
          </div>

          {/* Interactive Melody Synth Player Button */}
          <button
            type="button"
            onClick={handlePlayMelody}
            disabled={isPlayingMelody}
            className="w-full bg-[#FF4D8D] hover:bg-[#FF2E79] disabled:opacity-80 text-white font-heading font-black text-sm uppercase border-3 border-black shadow-neo rounded-xl py-3 px-4 transition-all hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
          >
            {isPlayingMelody ? (
              <>
                <Volume2 className="w-4 h-4 animate-spin" />
                <span>Playing Synth Riff... 🎶</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>▶ Play Melody Preview</span>
              </>
            )}
          </button>
        </div>

        {/* Right 6 Cols: Box Office #1 Movie */}
        <div className="lg:col-span-6 neo-card p-6 sm:p-8 bg-[#00F5FF] space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-black text-[#00F5FF] font-heading font-black text-xs uppercase px-3 py-1 border-2 border-black rounded-lg shadow-neo-xs flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> BOX OFFICE SMASH
              </span>
              <span className="bg-white text-black font-heading font-black text-xs px-2 py-0.5 border-2 border-black rounded shadow-neo-xs">
                {popCulture.boxOfficeMovie.worldwideGross}
              </span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl text-black leading-tight">
              {popCulture.boxOfficeMovie.title}
            </h3>
            <div className="font-heading font-bold text-sm text-black/80">
              Directed by {popCulture.boxOfficeMovie.director} • {popCulture.boxOfficeMovie.genre}
            </div>

            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-neo-xs font-heading font-black text-base text-black">
              "{popCulture.boxOfficeMovie.quote}"
            </div>
          </div>

          <p className="text-xs font-heading font-semibold text-black/80 bg-white/70 p-3 border-2 border-black rounded-xl">
            🎬 {popCulture.boxOfficeMovie.tagline}
          </p>
        </div>

      </div>

      {/* 3-Column Cultural Tags: TV Shows, Fashion, Toys & Slang */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hit TV Shows */}
        <div className="neo-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Tv className="w-5 h-5 text-[#2563EB]" />
            <h4 className="font-display font-black text-lg text-black uppercase">
              Hit TV Shows
            </h4>
          </div>
          <ul className="space-y-2">
            {popCulture.tvShows.map((show) => (
              <li
                key={show}
                className="bg-[#FFFDF0] border-2 border-black rounded-xl p-2.5 font-heading font-bold text-xs text-black shadow-neo-xs flex items-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>{show}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fashion & Retro Toys */}
        <div className="neo-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Gamepad2 className="w-5 h-5 text-[#FF4D8D]" />
            <h4 className="font-display font-black text-lg text-black uppercase">
              Fashion & Toys
            </h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-heading font-black text-neutral-500 uppercase mb-1.5">
                FASHION CRAZES:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popCulture.fashionTrends.map((trend) => (
                  <span
                    key={trend}
                    className="bg-[#CCFF00] text-black text-[11px] font-heading font-bold px-2 py-0.5 border border-black rounded shadow-neo-xs"
                  >
                    {trend}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-heading font-black text-neutral-500 uppercase mb-1.5">
                ICONIC TOYS & GAMES:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popCulture.toysGames.map((toy) => (
                  <span
                    key={toy}
                    className="bg-[#FFE600] text-black text-[11px] font-heading font-bold px-2 py-0.5 border border-black rounded shadow-neo-xs"
                  >
                    {toy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Era Slang Decoder */}
        <div className="neo-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Tag className="w-5 h-5 text-[#FF7A00]" />
            <h4 className="font-display font-black text-lg text-black uppercase">
              Era Slang Decoder
            </h4>
          </div>
          <div className="space-y-2.5">
            {popCulture.slang.map((item) => (
              <div
                key={item.term}
                className="bg-[#FFFDF0] border-2 border-black rounded-xl p-2.5 shadow-neo-xs"
              >
                <div className="font-display font-black text-sm text-[#FF4D8D] uppercase">
                  "{item.term}"
                </div>
                <div className="text-xs font-heading font-semibold text-neutral-700">
                  {item.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Nostalgia Synth Piano */}
      <div className="neo-card p-6 bg-[#00F5FF] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-black text-[#FFE600] rounded-xl flex items-center justify-center font-black">
              🎹
            </span>
            <div>
              <h4 className="font-display font-black text-lg text-black uppercase">
                Retro Nostalgia Jukebox Keyboard
              </h4>
              <div className="text-xs font-heading font-bold text-black/80">
                Tap keys to play authentic retro synthesizer sounds from the era
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => audioEngine.playConfettiFanfare()}
            className="bg-[#FFE600] text-black font-heading font-black text-xs uppercase px-3 py-1.5 border-2 border-black rounded-lg shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            🎉 Fanfare Chords
          </button>
        </div>

        {/* Piano Keys */}
        <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto pt-2">
          {[
            { note: 'C4', label: 'DO', freq: 261.63, color: 'bg-white text-black' },
            { note: 'D4', label: 'RE', freq: 293.66, color: 'bg-[#FFE600] text-black' },
            { note: 'E4', label: 'MI', freq: 329.63, color: 'bg-white text-black' },
            { note: 'F4', label: 'FA', freq: 349.23, color: 'bg-[#FF4D8D] text-white' },
            { note: 'G4', label: 'SO', freq: 392.00, color: 'bg-white text-black' },
            { note: 'A4', label: 'LA', freq: 440.00, color: 'bg-[#CCFF00] text-black' },
            { note: 'B4', label: 'TI', freq: 493.88, color: 'bg-white text-black' },
            { note: 'C5', label: 'DO²', freq: 523.25, color: 'bg-[#C084FC] text-black' },
          ].map((key) => (
            <button
              key={key.note}
              type="button"
              onClick={() => audioEngine.playSingleNote(key.freq, 0.45)}
              className={`${key.color} border-3 border-black rounded-2xl p-3 sm:p-4 text-center shadow-neo-xs hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all flex flex-col items-center justify-between h-24 sm:h-28`}
            >
              <span className="font-mono font-black text-xs opacity-75">{key.note}</span>
              <span className="font-display font-black text-sm sm:text-base">{key.label}</span>
              <span className="text-[10px] opacity-60">♪</span>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};

