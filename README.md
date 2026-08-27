# The Day You Entered the World 🚀

> A responsive web application crafted in an authentic **Neo-Brutalism** design language. Discover the world as it stood the exact moment your story began — from astronomical moon phases and Billboard #1 anthems to historical headlines, weather reconstruction, living costs, and shareable keepsake cards.

---

## 🌟 Key Features

1. **🎨 Authentic Neo-Brutalism Aesthetic**:
   - Split color-block background (Azure Cyan `#00C2FF` & Warm Yellow Grid `#FFE600`).
   - Signature geometric decals (Green 8-point Asterisk Starburst, Pink Zigzag Ribbon, Blue Donut Torus, Orange Wavy Blob, Lilac Sparkle Stars).
   - Solid 3.5px–4px black borders, tactile hard drop shadows, and modern typography (Syne, Space Grotesk, Plus Jakarta Sans, JetBrains Mono).

2. **⏳ Animated Time-Travel Sequence**:
   - Accelerated digital calendar counting backwards from 2026 to your birth year.
   - Real-time pitch-shifting sound ticks and era milestones with celebratory confetti fanfare.

3. **📊 8 Personalized Dashboard Sections**:
   - **1. Your Arrival**: Western & Chinese Zodiac with 5-element Wu Xing cycle, astronomical SVG moon phase with real illumination %, vitality ticker (~billions of heartbeats & breaths), birthstone & flower badges.
   - **2. The World That Day**: Global news headline collage, local atmosphere spotlight for your birth city, and shared famous birthdays.
   - **3. The Sky Above You**: Historical climate reconstruction with **°C / °F toggle**, weather condition icons, humidity, wind speed, and sunrise/sunset solar arc.
   - **4. What Life Cost**: Price comparisons (Gold, Petrol, Bread, Milk, Movie Tickets, Homes, Cars, Flagship Tech) with a live **multi-currency converter (USD, EUR, GBP, INR, CAD, AUD, JPY)** and inflation multiplier.
   - **5. What Everyone Loved**: Billboard #1 Hit Song with interactive **“▶ Play Melody Preview”** synthesizer button, Box Office smash, TV shows, retro fashion, toys, and era slang decoder.
   - **6. Good Things Happened**: Uplifting humanitarian milestones, Nobel prizes, space exploration, and wholesome historical achievements.
   - **7. Then vs Now**: High-impact comparative metric cards (Population, Life Expectancy, Gold, Transistors/Compute, Internet).
   - **8. Your Birth Day Story (Keepsake Generator)**: Customizable postcard with 5 Neo-Brutalist themes, custom dedication editor, **High-DPI HTML5 Canvas PNG Generator (1200x1600)** with 1-click download, Web Share API, and print layout.

4. **🎵 Web Audio Generative Sound Synthesizer**:
   - Nostalgic generative ambient synthesizer (zero external dependencies).
   - Cheerful marimba-style pop sound effects on navigation tabs and currency selection.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Audio Engine**: Pure Web Audio API (100% offline, zero audio asset dependencies)
- **Image Generation**: HTML5 2D Canvas API (High-DPI export)
- **Deployment**: Vercel, Netlify, Render, GitHub Pages

---

## 🚀 One-Click Deploy / Publishing Options

### Option 1: Vercel (Recommended)
This repository contains a pre-configured `vercel.json`:
1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the repository in [Vercel](https://vercel.com).
3. Vercel will automatically detect `vercel.json` and deploy the production build in seconds!

### Option 2: Netlify
1. Connect your repository to [Netlify](https://netlify.com).
2. Set **Build Command**: `cd client && npm install && npm run build`
3. Set **Publish Directory**: `client/dist`
4. Click **Deploy**.

### Option 3: Local / Self-Hosted
```bash
# 1. Install dependencies
cd client
npm install

# 2. Build for production
npm run build

# 3. Preview production build
npm run preview
```

