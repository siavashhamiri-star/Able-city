// Speech Synthesis and Audio Chime Narrator for Interactive Visual & Audio Guide

class AudioNarrator {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback: ((speaking: boolean) => void) | null = null;

  public setCallback(cb: (speaking: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public speak(text: string, lang = 'fa-IR') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95; // Slightly measured rate for clarity
      utterance.pitch = 1.05;

      // Try to find Persian voice or fallback
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(lang.slice(0, 2)) || v.lang.includes('fa') || v.lang.includes('ar'));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback(true);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback(false);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
      if (this.onStateChangeCallback) this.onStateChangeCallback(false);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const narrator = new AudioNarrator();
