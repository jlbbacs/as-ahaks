import { AI_CONFIG, DEFAULT_SYSTEM_PROMPT } from '../config/ai';
import { Message } from '../types';

export class AIService {
  private apiKey: string;
  private baseURL: string;
  private provider: 'openai' | 'deepseek' | 'openrouter';
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // 1 second between requests

  constructor(apiKey?: string) {
    this.provider = AI_CONFIG.provider;
    this.apiKey = apiKey || AI_CONFIG.apiKey;
    
    // Set the appropriate base URL for the provider
    this.baseURL = this.provider === 'openai' 
      ? 'https://api.openai.com/v1'
      : this.provider === 'deepseek'
        ? 'https://api.deepseek.com/v1'
        : 'https://openrouter.ai/api/v1';
    
    if (!this.apiKey) {
      const providerName = this.provider === 'openai' ? 'OpenAI' : this.provider === 'deepseek' ? 'DeepSeek' : 'OpenRouter';
      const envVarName = this.provider === 'openai' ? 'VITE_OPENAI_API_KEY' : this.provider === 'deepseek' ? 'VITE_DEEPSEEK_API_KEY' : 'VITE_OPENROUTER_API_KEY';
      throw new Error(`${providerName} API key is required. Please set ${envVarName} environment variable.`);
    }
  }

  private async rateLimitedFetch(url: string, options: RequestInit): Promise<Response> {
    // Wait if we're making requests too quickly
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    return fetch(url, options);
  }

  async generateResponse(messages: Message[], systemPrompt?: string): Promise<string> {
    try {
      const requestBody = {
        model: AI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt || DEFAULT_SYSTEM_PROMPT
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens
      };

      console.log('API Request:', {
        url: `${this.baseURL}/chat/completions`,
        model: AI_CONFIG.model,
        messageCount: requestBody.messages.length,
        hasApiKey: !!this.apiKey,
        apiKeyPrefix: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'none'
      });

      const response = await this.rateLimitedFetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...(this.provider === 'openrouter' && {
            'HTTP-Referer': 'http://localhost:5174', // Optional: helps with rate limits
            'X-Title': 'Conversational AI Builder' // Optional: for tracking
          })
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorData
        });
        
        // Check for specific error messages in the response
        if (errorData.includes('Insufficient Balance')) {
          const providerName = this.provider === 'openai' ? 'OpenAI' : 'DeepSeek';
          const billingUrl = this.provider === 'openai' 
            ? 'https://platform.openai.com/settings/organization/billing'
            : 'https://platform.deepseek.com/usage';
          throw new Error(`Insufficient balance in your ${providerName} account.\n\nTo fix this:\n1. Visit ${billingUrl}\n2. Add a payment method\n3. Purchase credits\n\nNote: DeepSeek credits are very affordable!`);
        }
        
        // Check for specific error messages in the response
        if (errorData.includes('Insufficient Balance')) {
          const providerName = this.provider === 'openai' ? 'OpenAI' : this.provider === 'deepseek' ? 'DeepSeek' : 'OpenRouter';
          const billingUrl = this.provider === 'openai' 
            ? 'https://platform.openai.com/settings/organization/billing'
            : this.provider === 'deepseek'
              ? 'https://platform.deepseek.com/usage'
              : 'https://openrouter.ai/credits';
          throw new Error(`Insufficient balance in your ${providerName} account.\n\nTo fix this:\n1. Visit ${billingUrl}\n2. Add a payment method\n3. Purchase credits\n\nNote: ${this.provider === 'openrouter' ? 'OpenRouter has generous free tiers!' : 'DeepSeek credits are very affordable!'}`);
        }
        
        if (response.status === 401) {
          const providerName = this.provider === 'openai' ? 'OpenAI' : this.provider === 'deepseek' ? 'DeepSeek' : 'OpenRouter';
          throw new Error(`Invalid API key. Please check your ${providerName} API key configuration.`);
        }
        if (response.status === 429) {
          const providerName = this.provider === 'openai' ? 'OpenAI' : this.provider === 'deepseek' ? 'DeepSeek' : 'OpenRouter';
          const usageUrl = this.provider === 'openai' 
            ? 'https://platform.openai.com/usage'
            : this.provider === 'deepseek'
              ? 'https://platform.deepseek.com/usage'
              : 'https://openrouter.ai/activity';
          throw new Error(`Rate limit exceeded. This could mean:\n1. You've hit your free tier limit\n2. You need to add billing to your ${providerName} account\n3. You're making requests too quickly\n\nPlease check your usage at ${usageUrl}`);
        }
        if (response.status === 402 || errorData.includes('Insufficient Balance')) {
          const providerName = this.provider === 'openai' ? 'OpenAI' : this.provider === 'deepseek' ? 'DeepSeek' : 'OpenRouter';
          const billingUrl = this.provider === 'openai' 
            ? 'https://platform.openai.com/settings/organization/billing'
            : this.provider === 'deepseek'
              ? 'https://platform.deepseek.com/usage'
              : 'https://openrouter.ai/credits';
          throw new Error(`Insufficient balance in your ${providerName} account.\n\nTo fix this:\n1. Visit ${billingUrl}\n2. Add a payment method\n3. Purchase credits\n\nNote: ${this.provider === 'openrouter' ? 'OpenRouter is much cheaper than OpenAI!' : 'DeepSeek is much cheaper than OpenAI!'}`);
        }
        if (response.status === 402 || errorData.includes('Insufficient Balance')) {
          const providerName = this.provider === 'openai' ? 'OpenAI' : 'DeepSeek';
          const billingUrl = this.provider === 'openai' 
            ? 'https://platform.openai.com/settings/organization/billing'
            : 'https://platform.deepseek.com/usage';
          throw new Error(`Insufficient balance in your ${providerName} account.\n\nTo fix this:\n1. Visit ${billingUrl}\n2. Add a payment method\n3. Purchase credits\n\nNote: DeepSeek is much cheaper than OpenAI!`);
        }
        if (response.status === 400) {
          throw new Error(`Bad request: ${errorData}`);
        }
        if (response.status === 403) {
          throw new Error('Access forbidden. Check your API key permissions.');
        }
        if (response.status >= 500) {
          throw new Error('OpenAI server error. Please try again later.');
        }
        
        throw new Error(`API request failed (${response.status}): ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AI service');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate AI response');
    }
  }
}