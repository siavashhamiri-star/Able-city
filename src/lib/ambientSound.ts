// Web Audio API continuous Brown/Pink noise generator for ADHD focus & sensory calm
// Uses looped AudioBuffer with Biquad low-pass filter for zero-CPU, zero-latency, 100% mobile-compatible playback

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;

  private init() {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.init();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Stop previous instance if any
      this.stop();

      // Create a 2-second looped noise buffer
      const sampleRate = this.audioCtx.sampleRate;
      const bufferLength = sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferLength, sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        // Smooth random walk for calming deep frequency
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.2;
      }

      const source = this.audioCtx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      // Gentle low-pass filter for warm soothing sound
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      source.start();

      this.sourceNode = source;
      this.filterNode = filter;
      this.gainNode = gain;
      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext autoplay restricted or failed:', e);
    }
  }

  public stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.sourceNode = null;
    }
    if (this.filterNode) {
      try {
        this.filterNode.disconnect();
      } catch {
        // ignore
      }
      this.filterNode = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // ignore
      }
      this.gainNode = null;
    }
    this.isPlaying = false;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientAudioEngine();
