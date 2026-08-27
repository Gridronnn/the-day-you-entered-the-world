import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

export const AudioFloatingWidget: React.FC<{
  isPlaying: boolean;
  onToggle: () => void;
}> = ({ isPlaying, onToggle }) => {
  const [volume, setVolumeState] = useState(30);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolumeState(val);
    audioEngine.setVolume(val / 100);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-white border-3 border-black shadow-neo-lg rounded-2xl p-2.5">
      <button
        type="button"
        onClick={onToggle}
        className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-bold transition-transform active:scale-95 ${
          isPlaying ? 'bg-[#FFE600] shadow-neo-xs' : 'bg-neutral-100'
        }`}
        title={isPlaying ? 'Pause Ambient Soundtrack' : 'Play Ambient Soundtrack'}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-black animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5 text-neutral-500" />
        )}
      </button>

      <div className="hidden sm:flex flex-col pr-1">
        <div className="flex items-center justify-between text-[10px] font-heading font-black text-neutral-600 uppercase">
          <span>NOSTALGIA TAPE</span>
          <span>{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#FF4D8D]"
        />
      </div>
    </div>
  );
};
