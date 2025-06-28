import { AI_CONFIG, DEFAULT_SYSTEM_PROMPT } from '../config/ai';
import { Message } from '../types';

export class AIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || AI_CONFIG.apiKey;
  }

  async generateResponse(messages: Message[], systemPrompt?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
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
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
        }
        throw new Error(`API request failed: ${response.statusText}`);
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