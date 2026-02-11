
class SpeechService {
  private synth: SpeechSynthesis;
  private frenchVoice: SpeechSynthesisVoice | null = null;
  private defaultRate: number = 0.9;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initVoices();
  }

  private initVoices() {
    const voices = this.synth.getVoices();
    this.frenchVoice = voices.find(v => v.lang.startsWith('fr')) || null;
    
    if (!this.frenchVoice) {
      this.synth.onvoiceschanged = () => {
        const updatedVoices = this.synth.getVoices();
        this.frenchVoice = updatedVoices.find(v => v.lang.startsWith('fr')) || null;
      };
    }
  }

  speak(text: string, rate?: number) {
    if (this.synth.speaking) this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.frenchVoice) {
      utterance.voice = this.frenchVoice;
    }
    utterance.lang = 'fr-FR';
    utterance.rate = rate || this.defaultRate;
    this.synth.speak(utterance);
  }

  speakWordAt(text: string, charIndex: number, rate?: number) {
    const words = text.split(/(\s+)/);
    let currentLength = 0;
    let targetWord = "";

    for (const segment of words) {
      if (charIndex >= currentLength && charIndex < currentLength + segment.length) {
        targetWord = segment.trim();
        if (!targetWord && words[words.indexOf(segment) + 1]) {
            targetWord = words[words.indexOf(segment) + 1].trim();
        }
        break;
      }
      currentLength += segment.length;
    }

    if (targetWord) {
      this.speak(targetWord, rate);
    }
  }
}

export const speechService = new SpeechService();
