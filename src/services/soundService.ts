// Web Audio API Synthesizer for Authentic Devotional Temple Bell Sounds
class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = true;

  constructor() {
    // AudioContext created lazily on user interaction
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initCtx();
      this.playTempleBell();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Synthesize a resonant Indian Temple Bell (Ghanti) sound
  public playTempleBell(frequency: number = 880) {
    if (this.isMuted) return;

    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Primary tone oscillator
      const osc1 = this.audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);

      // Overtone oscillator for metallic resonance
      const osc2 = this.audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2.76, now);

      // Gain Envelope
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0); // Bell decay

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 3.2);
      osc2.stop(now + 3.2);
    } catch {
      // Audio context policy fallback
    }
  }

  public playDevotionalChime() {
    if (this.isMuted) return;
    this.playTempleBell(1046.5); // High C bell
    setTimeout(() => this.playTempleBell(1318.5), 180); // High E bell
  }
}

export const soundService = new SoundService();
