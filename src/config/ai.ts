import { AIConfig } from '../types';

// Configuration for AI service
// In production, these should be environment variables
export const AI_CONFIG: AIConfig = {
  apiKey: 'key_ffb6dbecfb3380f13593bbbdf0ad', // Replace with your actual API key
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500
};
//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
export const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant. Provide clear, concise, and helpful responses. Keep responses conversational and engaging.`;