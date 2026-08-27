// Pure Web Audio API Generative Engine (Zero external dependencies)
class WebAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient: boolean = false;
  private ambientTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingAmbient;
  }

  public toggleAmbient(): boolean {
    if (this.isPlayingAmbient) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  public startAmbient() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.isPlayingAmbient = true;

    // Nostalgic Pentatonic Chord Progressions (Warm, celestial, dreamy chords)
    const chordProgressions = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 261.63, 329.63, 440.00], // A Minor
      [174.61, 220.00, 261.63, 349.23], // F Major
      [196.00, 246.94, 293.66, 392.00], // G Major
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!this.isPlayingAmbient || !this.ctx || !this.masterGain) return;

      const chord = chordProgressions[chordIndex % chordProgressions.length];
      chordIndex++;

      // Play soft polyphonic chord with warm envelope
      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Low-pass filter for vintage warm tape character
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800 + i * 200, this.ctx.currentTime);

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        const noteDelay = i * 0.08; // Arpeggio strum effect
        const duration = 4.5;

        noteGain.gain.setValueAtTime(0.001, now + noteDelay);
        noteGain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + noteDelay + 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + duration);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now + noteDelay);
        osc.stop(now + noteDelay + duration);
      });

      // Play subtle chime sprinkle
      if (Math.random() > 0.4) {
        setTimeout(() => {
          this.playSingleChime(chord[Math.floor(Math.random() * chord.length)] * 2);
        }, 1200);
      }

      this.ambientTimer = window.setTimeout(playNextChord, 4200);
    };

    playNextChord();
  }

  public stopAmbient() {
    this.isPlayingAmbient = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  public playSingleChime(freq: number = 880) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  public playTabClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const now = this.ctx.currentTime;
    osc.type = 'sine';
    // Cheerful warm marimba-style pop: starts around 620Hz and bounces to 880Hz
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.035);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.075);
  }

  public playTimeTravelTick(pitchFactor: number = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440 * pitchFactor, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880 * pitchFactor, this.ctx.currentTime + 0.05);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  public playConfettiFanfare() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

      const start = this.ctx.currentTime + idx * 0.09;
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.8);
    });
  }

  public playMelodySequence(notes: { freq: number; duration: number }[], onComplete?: () => void) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    let accumulatedTime = this.ctx.currentTime + 0.05;

    notes.forEach((note) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, accumulatedTime);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.freq, accumulatedTime);

      gain.gain.setValueAtTime(0.001, accumulatedTime);
      gain.gain.linearRampToValueAtTime(0.14, accumulatedTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, accumulatedTime + note.duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(accumulatedTime);
      osc.stop(accumulatedTime + note.duration);

      accumulatedTime += note.duration + 0.04;
    });

    if (onComplete) {
      const totalDuration = (accumulatedTime - this.ctx.currentTime) * 1000;
      setTimeout(onComplete, totalDuration);
    }
  }

  public playSingleNote(freq: number, duration: number = 0.4) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, this.ctx.currentTime);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const audioEngine = new WebAudioSynthesizer();
