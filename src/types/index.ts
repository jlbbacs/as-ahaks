export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

export interface AIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface VoiceSettings {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}