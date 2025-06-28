import { VoiceSettings } from '../types';

export class SpeechService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices(): void {
    // Load available voices
    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    updateVoices();
    
    // Some browsers load voices asynchronously
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices;
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  speak(text: string, settings: VoiceSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!settings.enabled) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find the selected voice
      const selectedVoice = this.voices.find(voice => voice.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  stop(): void {
    this.synthesis.cancel();
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}