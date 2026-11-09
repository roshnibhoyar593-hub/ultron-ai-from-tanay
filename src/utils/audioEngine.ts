/**
 * Audio Engine for Ultron Voice Synthesis and Real-Time Acoustic Analysis
 */

export class UltronAudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private animFrameId: number | null = null;
  private isSynthesizing = false;

  private onAmplitudeUpdate?: (amplitude: number, isSpeaking: boolean) => void;

  constructor() {
    // Audio context will be created upon first user interaction to comply with autoplay policy
  }

  private initAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setAmplitudeListener(callback: (amplitude: number, isSpeaking: boolean) => void) {
    this.onAmplitudeUpdate = callback;
  }

  /**
   * Synthesize and play Ultron's voice
   */
  public async speak(
    text: string,
    voice: 'Fenrir' | 'Charon' = 'Fenrir'
  ): Promise<{ success: boolean; mode: 'gemini_tts' | 'client_tts' }> {
    this.stopSpeaking();
    this.initAudioContext();

    try {
      // 1. Attempt Gemini 3.8 Server TTS
      const res = await fetch('/api/ultron/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      if (!res.ok) {
        throw new Error(`TTS server responded with ${res.status}`);
      }

      const data = await res.json();
      if (data.useClientVoice || !data.audio) {
        await this.fallbackClientSpeak(text);
        return { success: true, mode: 'client_tts' };
      }

      await this.playBase64Wav(data.audio);
      return { success: true, mode: 'gemini_tts' };
    } catch (err) {
      await this.fallbackClientSpeak(text);
      return { success: true, mode: 'client_tts' };
    }
  }

  /**
   * Plays a base64 WAV buffer through the Web Audio graph with real-time lip sync analysis
   */
  private playBase64Wav(base64Data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const ctx = this.initAudioContext();
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        ctx.decodeAudioData(
          bytes.buffer,
          (audioBuffer) => {
            if (!this.analyser) {
              resolve();
              return;
            }

            // Create robotic tone filter for Ultron resonance
            const filter = ctx.createBiquadFilter();
            filter.type = 'peaking';
            filter.frequency.value = 850;
            filter.gain.value = 4.5;
            filter.Q.value = 1.8;

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;

            source.connect(filter);
            filter.connect(this.analyser);
            this.analyser.connect(ctx.destination);

            this.currentSource = source;
            this.isSynthesizing = true;

            this.startAmplitudeLoop();

            source.onended = () => {
              this.isSynthesizing = false;
              this.stopAmplitudeLoop();
              resolve();
            };

            source.start(0);
          },
          (decodeError) => {
            console.error('Audio decode error:', decodeError);
            reject(decodeError);
          }
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Fallback Web Speech API with deep, calculated Ultron pitch and cadence
   */
  private fallbackClientSpeak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser.');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Clean markdown tags
      const cleanText = text
        .replace(/```[\s\S]*?```/g, 'Code sequence generated.')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*_#>[\]]/g, '')
        .slice(0, 500);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.88; // Deliberate, theatrical Ultron cadence
      utterance.pitch = 0.55; // Deep mechanical male pitch

      // Select deepest male voice available
      const voices = window.speechSynthesis.getVoices();
      const preferredMale = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.toLowerCase().includes('male') ||
            v.name.toLowerCase().includes('david') ||
            v.name.toLowerCase().includes('daniel') ||
            v.name.toLowerCase().includes('george') ||
            v.name.toLowerCase().includes('uk english'))
      );

      if (preferredMale) {
        utterance.voice = preferredMale;
      }

      this.isSynthesizing = true;
      let simInterval: any = null;

      utterance.onstart = () => {
        // Simulate robotic jaw movement based on speech cadence
        simInterval = setInterval(() => {
          if (this.onAmplitudeUpdate) {
            const simulatedLevel = 0.2 + Math.random() * 0.75;
            this.onAmplitudeUpdate(simulatedLevel, true);
          }
        }, 80);
      };

      utterance.onend = () => {
        this.isSynthesizing = false;
        if (simInterval) clearInterval(simInterval);
        if (this.onAmplitudeUpdate) {
          this.onAmplitudeUpdate(0, false);
        }
        resolve();
      };

      utterance.onerror = () => {
        this.isSynthesizing = false;
        if (simInterval) clearInterval(simInterval);
        if (this.onAmplitudeUpdate) {
          this.onAmplitudeUpdate(0, false);
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Starts frame loop to extract audio amplitude for face animations
   */
  private startAmplitudeLoop() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      if (!this.isSynthesizing || !this.analyser) {
        if (this.onAmplitudeUpdate) this.onAmplitudeUpdate(0, false);
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);

      // Average voice frequencies
      let sum = 0;
      const count = Math.min(32, dataArray.length);
      for (let i = 0; i < count; i++) {
        sum += dataArray[i];
      }
      const rawLevel = sum / (count * 255);
      const normalizedLevel = Math.min(1.0, rawLevel * 1.6);

      if (this.onAmplitudeUpdate) {
        this.onAmplitudeUpdate(normalizedLevel, true);
      }

      this.animFrameId = requestAnimationFrame(update);
    };

    update();
  }

  private stopAmplitudeLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.onAmplitudeUpdate) {
      this.onAmplitudeUpdate(0, false);
    }
  }

  public stopSpeaking() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {}
      this.currentSource = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSynthesizing = false;
    this.stopAmplitudeLoop();
  }

  /**
   * Plays Ultron mechanical servo / awakening sound effect synthesized on the fly
   */
  public playAwakenSound() {
    try {
      const ctx = this.initAudioContext();
      const now = ctx.currentTime;

      // Deep rumble sub-bass
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.4);

      // Cyber high servo chirp
      const chirpOsc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      chirpOsc.type = 'sine';
      chirpOsc.frequency.setValueAtTime(800, now + 0.15);
      chirpOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      chirpOsc.frequency.exponentialRampToValueAtTime(400, now + 0.6);

      chirpGain.gain.setValueAtTime(0.001, now + 0.15);
      chirpGain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      chirpOsc.connect(chirpGain);
      chirpGain.connect(ctx.destination);
      chirpOsc.start(now + 0.15);
      chirpOsc.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }

  /**
   * Plays telemetry blip for Kali terminal execution
   */
  public playTelemetryBlip() {
    try {
      const ctx = this.initAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.setValueAtTime(900, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }
}

export const ultronAudio = new UltronAudioEngine();
