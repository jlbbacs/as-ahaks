import { AIConfig } from '../types';

// Configuration for AI service
// Supports OpenAI, DeepSeek (native), and OpenRouter
const provider = import.meta.env.VITE_AI_PROVIDER || 'openrouter';
const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
const openrouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';

// Get API key based on provider
const apiKey =
  provider === 'openai'
    ? openaiApiKey
    : provider === 'deepseek'
      ? deepseekApiKey
      : openrouterApiKey;

// Debug logging (remove in production)
console.log('AI Provider Configuration:', {
  provider,
  hasApiKey: !!apiKey,
  keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
  keyLength: apiKey.length
});

// Model selection
const model =
  provider === 'openai'
    ? 'gpt-3.5-turbo'
    : provider === 'deepseek'
      ? 'deepseek-chat' // adjust if using DeepSeek's native API
      : 'deepseek/deepseek-r1-0528:free'; // via OpenRouter

export const AI_CONFIG: AIConfig = {
  provider: provider as 'openai' | 'deepseek' | 'openrouter',
  apiKey,
  model,
  temperature: 0.7,
  maxTokens: 500
};

export const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant. Provide clear, concise, and helpful responses. Keep responses conversational and engaging.`;
