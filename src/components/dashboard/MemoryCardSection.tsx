import React, { useState, useRef } from 'react';
import { Download, Share2, Printer, Sparkles, Heart, Check, Copy, Moon, Music, Compass, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayDataPayload } from '../../types/history';
import {
  GreenAsteriskDecal,
  PinkZigzagDecal,
  BlueDonutDecal,
  YellowSemicircleDecal,
} from '../common/NeoStickers';

type CardTheme = 'sunshine' | 'cyan' | 'pink' | 'lime' | 'violet' | 'cream';

export const MemoryCardSection: React.FC<{ data: DayDataPayload }> = ({ data }) => {
  const { input, dayFacts, zodiac, popCulture, weather } = data;
  const [theme, setTheme] = useState<CardTheme>('sunshine');
  const [customName, setCustomName] = useState(input.userName || '');
  const [customNote, setCustomNote] = useState('On this day, while the world was busy living its story, you arrived and began yours.');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [yStr, mStr, dStr] = input.birthDate.split('-');
  const dateObj = new Date(Number(yStr), Number(mStr) - 1, Number(dStr));
  const monthName = dateObj.toLocaleString('default', { month: 'long' });

  const themeStyles: Record<
    CardTheme,
    { bg: string; border: string; accent: string; text: string; subtext: string }
  > = {
    sunshine: { bg: '#FFE600', border: '#000000', accent: '#FF4D8D', text: '#000000', subtext: '#333333' },
    cyan: { bg: '#00F5FF', border: '#000000', accent: '#FFE600', text: '#000000', subtext: '#333333' },
    pink: { bg: '#FF4D8D', border: '#000000', accent: '#FFE600', text: '#FFFFFF', subtext: '#FFFDF0' },
    lime: { bg: '#CCFF00', border: '#000000', accent: '#00F5FF', text: '#000000', subtext: '#333333' },
    violet: { bg: '#B75DFF', border: '#000000', accent: '#FFE600', text: '#FFFFFF', subtext: '#FFFDF0' },
    cream: { bg: '#FFFDF0', border: '#000000', accent: '#FFE600', text: '#000000', subtext: '#444444' },
  };

  const currentTheme = themeStyles[theme];

  const handleConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#00F5FF', '#FF4D8D', '#CCFF00', '#000000'],
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const handleCopySummary = () => {
    const titleName = customName ? `${customName}'s` : 'My';
    const text = `✨ ${titleName} Birth Day Story ✨\n` +
      `📅 Born: ${dayFacts.dayOfWeek}, ${monthName} ${dStr}, ${yStr}\n` +
      `📍 City: ${input.birthCity}\n` +
      `⭐ Zodiac: ${zodiac.western.sign} (${zodiac.western.element}) • Year of the ${zodiac.chinese.animal}\n` +
      `🌕 Moon Phase: ${zodiac.moonPhase.name} (${zodiac.moonPhase.illuminationPct}% illuminated)\n` +
      `🎶 #1 Song: "${popCulture.billboardSong.title}" by ${popCulture.billboardSong.artist}\n` +
      `🎬 Top Movie: "${popCulture.boxOfficeMovie.title}"\n` +
      `🌡️ Weather: ${weather.tempC}°C (${weather.condition})\n` +
      `❤️ Total Days on Earth: ${dayFacts.daysLived.toLocaleString()} Days\n\n` +
      `“On this day, while the world was busy living its story, you arrived and began yours.”\n` +
      `Reconstructed at: The Day You Entered the World`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    handleConfetti();
  };

  const handleShare = async () => {
    const titleName = customName ? `${customName}'s` : 'My';
    const shareData = {
      title: `${titleName} Birth Day Story`,
      text: `Discover what the world was like on ${input.birthDate} in ${input.birthCity}!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        handleConfetti();
      } catch (err) {
        handleCopySummary();
      }
    } else {
      handleCopySummary();
    }
  };

  const handleDownloadImage = () => {
    setIsExporting(true);

    // High-resolution HTML5 Canvas render
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    const scale = 2; // High DPI
    canvas.width = 720 * scale;
    canvas.height = 960 * scale;
    ctx.scale(scale, scale);

    const w = 720;
    const h = 960;

    // Background
    ctx.fillStyle = currentTheme.bg;
    ctx.fillRect(0, 0, w, h);

    // Dark thick border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(5, 5, w - 10, h - 10);

    // Inner Card Container
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // Header Tag
    ctx.fillStyle = '#000000';
    ctx.fillRect(50, 50, w - 100, 48);
    ctx.fillStyle = '#FFE600';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ OFFICIAL BIRTHDAY PASSPORT ⚡', w / 2, 82);

    // Main Greeting / Name
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px "Space Grotesk", sans-serif';
    ctx.fillText(customName ? `KEEPSAKE FOR ${customName.toUpperCase()}` : 'THE DAY YOU ENTERED THE WORLD', w / 2, 140);

    ctx.font = '900 44px "Syne", sans-serif';
    ctx.fillText(`${dayFacts.dayOfWeek.toUpperCase()}`, w / 2, 190);

    ctx.font = 'bold 26px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#2563EB';
    ctx.fillText(`${monthName} ${dStr}, ${yStr} • ${input.birthCity.toUpperCase()}`, w / 2, 230);

    // Divider
    ctx.beginPath();
    ctx.moveTo(60, 260);
    ctx.lineTo(w - 60, 260);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // 4 Key Stats Blocks
    const drawBlock = (x: number, y: number, bw: number, bh: number, title: string, main: string, sub: string, fill: string) => {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, bw, bh);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, bw, bh);

      ctx.fillStyle = '#666666';
      ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(title, x + 16, y + 26);

      ctx.fillStyle = '#000000';
      ctx.font = '900 22px "Syne", sans-serif';
      ctx.fillText(main.length > 20 ? main.slice(0, 18) + '...' : main, x + 16, y + 58);

      ctx.fillStyle = '#333333';
      ctx.font = 'bold 14px "Space Grotesk", sans-serif';
      ctx.fillText(sub.length > 22 ? sub.slice(0, 20) + '...' : sub, x + 16, y + 84);
    };

    const colW = 285;
    const blockH = 100;

    // Block 1: Moon
    drawBlock(55, 280, colW, blockH, 'MOON PHASE', zodiac.moonPhase.name, `${zodiac.moonPhase.illuminationPct}% Lit`, '#FFFDF0');
    // Block 2: Zodiac
    drawBlock(380, 280, colW, blockH, 'CELESTIAL ZODIAC', `${zodiac.western.sign} ${zodiac.western.symbol}`, `Year of the ${zodiac.chinese.animal}`, '#FFFDF0');
    // Block 3: #1 Song
    drawBlock(55, 400, colW, blockH, '#1 HIT SOUNDTRACK', popCulture.billboardSong.title, `by ${popCulture.billboardSong.artist}`, '#FFE600');
    // Block 4: Days lived
    drawBlock(380, 400, colW, blockH, 'VITALITY', `${dayFacts.daysLived.toLocaleString()} Days Lived`, `~${(dayFacts.heartbeats / 1000000000).toFixed(1)}B Heartbeats`, '#00F5FF');

    // Weather & Birthstone Row
    drawBlock(55, 520, colW, blockH, 'BIRTH DAY WEATHER', `${weather.tempC}°C / ${weather.tempF}°F`, weather.condition, '#FFFDF0');
    drawBlock(380, 520, colW, blockH, 'BIRTHSTONE & FLOWER', zodiac.birthstone.modern, zodiac.birthFlower.name, '#FF4D8D');

    // Heartfelt Dedication Quote Box
    ctx.fillStyle = '#FFE600';
    ctx.fillRect(55, 645, w - 110, 140);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 645, w - 110, 140);

    ctx.fillStyle = '#000000';
    ctx.font = 'italic bold 18px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    
    // Wrap text
    const quoteWords = (customNote || "On this day, while the world was busy living its story, you arrived and began yours.").split(' ');
    let line1 = '';
    let line2 = '';
    let line3 = '';
    quoteWords.forEach((word) => {
      if ((line1 + word).length < 45) line1 += word + ' ';
      else if ((line2 + word).length < 45) line2 += word + ' ';
      else line3 += word + ' ';
    });

    ctx.fillText(`“${line1.trim()}`, w / 2, 690);
    if (line2) ctx.fillText(`${line2.trim()}`, w / 2, 720);
    if (line3) ctx.fillText(`${line3.trim()}”`, w / 2, 750);
    else if (!line3 && line2) ctx.fillText(`”`, w / 2 + 180, 720);

    // Footer Watermark
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ THE DAY YOU ENTERED THE WORLD • HISTORICAL PASSPORT ✨', w / 2, 825);
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#666666';
    ctx.fillText('Verified Historical Archive • Open-Meteo & Jean Meeus Ephemeris', w / 2, 850);

    // Export to download link
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `The_Day_You_Entered_The_World_${input.birthDate}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsExporting(false);
    handleConfetti();
  };

  return (
    <section id="sec-story" className="space-y-6 pt-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFE600] border-3 border-black rounded-2xl shadow-neo flex items-center justify-center font-display font-black text-2xl text-black rotate-[-2deg]">
            8
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#FF4D8D] text-white font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
                KEEPSAKE & COMMEMORATIVE POSTER
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
              My Birth Day Story Card
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfetti}
          className="neo-button-primary text-xs py-2 px-4 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Celebrate! 🎉</span>
        </button>
      </div>

      {/* Customizer & Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Controls & Options */}
        <div className="lg:col-span-5 neo-card p-6 bg-white space-y-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h3 className="font-display font-black text-xl text-black uppercase">
              Personalize Keepsake
            </h3>
            <span className="bg-[#CCFF00] text-black font-heading font-black text-xs uppercase px-2 py-0.5 border border-black rounded shadow-neo-xs">
              HD EXPORT
            </span>
          </div>

          {/* Theme Picker */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-black text-black uppercase block">
              Poster Color Scheme:
            </label>
            <div className="grid grid-cols-6 gap-2">
              {(['sunshine', 'cyan', 'pink', 'lime', 'violet', 'cream'] as CardTheme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`h-11 rounded-xl border-3 border-black shadow-neo-xs transition-transform cursor-pointer flex items-center justify-center ${
                    theme === t ? 'scale-110 ring-2 ring-black font-black' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: themeStyles[t].bg }}
                  title={t}
                >
                  {theme === t && '✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-black text-black uppercase block">
              Dedicated To (Name):
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Maya, Alex, Chris"
              className="neo-input w-full text-sm bg-[#FFFDF0]"
            />
          </div>

          {/* Personal Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-heading font-black text-black uppercase block">
              Heartfelt Message / Personal Quote:
            </label>
            <textarea
              rows={3}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="neo-input w-full text-sm bg-[#FFFDF0] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="w-full bg-[#FFE600] hover:bg-[#FFD600] text-black font-heading font-black text-sm uppercase py-3.5 px-4 border-3 border-black rounded-2xl shadow-neo hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-5 h-5 text-black" />
              <span>{isExporting ? 'Generating High-Res PNG...' : 'Download Keepsake Poster (PNG)'}</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="bg-[#00F5FF] hover:bg-[#00D9E5] text-black font-heading font-black text-xs uppercase py-3 px-3 border-3 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-black" />
                <span>{copied ? 'Copied!' : 'Share Card'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="bg-white hover:bg-neutral-100 text-black font-heading font-black text-xs uppercase py-3 px-3 border-3 border-black rounded-xl shadow-neo-xs hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-black" />
                <span>Print Poster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: The Classic Keepsake Memory Card Live Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-lg border-4 border-black rounded-3xl p-6 sm:p-8 shadow-neo-xl space-y-6 relative transition-colors duration-200"
            style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b-3 border-black pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-[#FF4D8D] rounded-full border border-black" />
                <span className="w-3.5 h-3.5 bg-[#FFE600] rounded-full border border-black" />
                <span className="w-3.5 h-3.5 bg-[#00F5FF] rounded-full border border-black" />
                <span className="font-heading font-black text-xs uppercase tracking-widest ml-1 text-black">
                  OFFICIAL BIRTHDAY PASSPORT
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-white border-2 border-black rounded-lg text-xs font-heading font-black uppercase text-black shadow-neo-xs">
                {input.birthCity}
              </span>
            </div>

            {/* User Name & Birth Date */}
            <div className="text-center space-y-1">
              <span className="text-xs font-heading font-black uppercase tracking-wider block opacity-75 text-black">
                {customName ? `KEEPSAKE FOR ${customName.toUpperCase()}` : 'THE DAY YOU ENTERED THE WORLD'}
              </span>
              <h3 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
                {dayFacts.dayOfWeek}
              </h3>
              <p className="font-heading font-bold text-base sm:text-lg text-black">
                {monthName} {dStr}, {yStr} • {input.birthCity}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-0.5 text-black">
                <span className="text-[10px] font-heading font-black text-neutral-500 uppercase block">Moon Phase</span>
                <span className="font-heading font-black text-sm block uppercase">{zodiac.moonPhase.name}</span>
                <span className="text-[11px] font-heading font-semibold text-neutral-600 block">{zodiac.moonPhase.illuminationPct}% Lit</span>
              </div>

              <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-0.5 text-black">
                <span className="text-[10px] font-heading font-black text-neutral-500 uppercase block">Celestial Zodiac</span>
                <span className="font-heading font-black text-sm block">{zodiac.western.sign} {zodiac.western.symbol}</span>
                <span className="text-[11px] font-heading font-semibold text-neutral-600 block">Year of the {zodiac.chinese.animal}</span>
              </div>

              <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-0.5 text-black">
                <span className="text-[10px] font-heading font-black text-neutral-500 uppercase block">#1 Soundtrack</span>
                <span className="font-heading font-black text-sm block truncate">{popCulture.billboardSong.title}</span>
                <span className="text-[11px] font-heading font-semibold text-neutral-600 block truncate">by {popCulture.billboardSong.artist}</span>
              </div>

              <div className="p-3.5 bg-white border-2 border-black rounded-2xl shadow-neo-xs space-y-0.5 text-black">
                <span className="text-[10px] font-heading font-black text-neutral-500 uppercase block">Total Days Lived</span>
                <span className="font-heading font-black text-sm text-[#FF4D8D] block">
                  {dayFacts.daysLived.toLocaleString()} Days
                </span>
                <span className="text-[11px] font-heading font-semibold text-neutral-600 block">~{(dayFacts.heartbeats / 1000000000).toFixed(1)}B Heartbeats</span>
              </div>
            </div>

            {/* Custom Dedication Note */}
            {customNote && (
              <p className="text-xs sm:text-sm font-heading font-bold text-center italic bg-white p-4 border-2 border-black rounded-2xl text-black shadow-neo-xs">
                "{customNote}"
              </p>
            )}

            {/* Footer */}
            <div className="pt-3 border-t-2 border-black/30 text-center space-y-1 text-[11px] font-heading font-bold text-black opacity-85">
              <p>✨ Historical Reconstruction • Open-Meteo, Wikipedia & Ephemeris Archives</p>
              <p className="font-mono text-[10px]">The Day You Entered The World</p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};

