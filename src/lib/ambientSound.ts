// Web Audio API continuous Brown/Pink noise generator for ADHD focus & sensory calm

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  private init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

      const bufferSize = 4096;
      let lastOut = 0.0;
      const scriptNode = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);

      // Brown noise algorithm (smooth random walk filtered for deep calming frequency)
      scriptNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 2.5; // gentle boost
        }
      };

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime); // gentle, non-fatiguing volume

      scriptNode.connect(gain);
      gain.connect(this.audioCtx.destination);

      this.noiseNode = scriptNode;
      this.gainNode = gain;
      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext not allowed without interaction:', e);
    }
  }

  public stop() {
    if (this.noiseNode && this.gainNode) {
      try {
        this.gainNode.disconnect();
        this.noiseNode.disconnect();
      } catch (e) {
        console.warn('Error stopping ambient audio:', e);
      }
      this.noiseNode = null;
      this.gainNode = null;
    }
    this.isPlaying = false;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientSound = new AmbientAudioEngine();
