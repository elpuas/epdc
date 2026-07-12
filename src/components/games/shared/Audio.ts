const MASTER_GAIN = 0.08;

export class ArcadeAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private muted = false;

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) {
      this.master.gain.value = muted ? 0 : MASTER_GAIN;
    }
  }

  unlock(): void {
    const context = this.ensureContext();
    if (context?.state === 'suspended') {
      void context.resume();
    }
  }

  laser(): void {
    this.tone(520, 940, 0.055, 'sawtooth');
  }

  explosion(): void {
    this.noise(0.18, 0.22);
    this.tone(130, 56, 0.18, 'triangle');
  }

  hit(): void {
    this.tone(210, 90, 0.14, 'square');
  }

  gameOver(): void {
    this.tone(260, 120, 0.28, 'triangle');
    window.setTimeout(() => this.tone(180, 72, 0.32, 'triangle'), 140);
  }

  private ensureContext(): AudioContext | undefined {
    if (this.muted) return undefined;
    if (this.context) return this.context;

    const AudioConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioConstructor) return undefined;

    this.context = new AudioConstructor();
    this.master = this.context.createGain();
    this.master.gain.value = MASTER_GAIN;
    this.master.connect(this.context.destination);
    return this.context;
  }

  private tone(startFrequency: number, endFrequency: number, duration: number, type: OscillatorType): void {
    const context = this.ensureContext();
    const master = this.master;
    if (!context || !master) return;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(startFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  private noise(duration: number, decay: number): void {
    const context = this.ensureContext();
    const master = this.master;
    if (!context || !master) return;

    const samples = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, samples, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < samples; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / samples);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const now = context.currentTime;

    filter.type = 'lowpass';
    filter.frequency.value = 780;
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start(now);
    source.stop(now + duration);
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
