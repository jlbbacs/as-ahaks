import { useState, useCallback, useRef } from 'react';
import { Message, VoiceSettings } from '../types';
import { AIService } from '../services/aiService';
import { SpeechService } from '../services/speechService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiService = useRef(new AIService());
  const speechService = useRef(new SpeechService());

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: speechService.current.isSupported(),
    voice: '',
    rate: 1,
    pitch: 1,
    volume: 1
  });

  const sendMessage = useCallback(async (content: string) => {
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate AI response
      const response = await aiService.current.generateResponse([...messages, userMessage]);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if voice is enabled
      if (voiceSettings.enabled) {
        try {
          await speechService.current.speak(response, voiceSettings);
        } catch (voiceError) {
          console.warn('Voice synthesis failed:', voiceError);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate response';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [messages, voiceSettings]);

  const playVoice = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.role !== 'assistant') return;

    // Update playing state
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isPlaying: true }
        : { ...msg, isPlaying: false }
    ));

    try {
      await speechService.current.speak(message.content, voiceSettings);
    } catch (err) {
      console.warn('Voice playback failed:', err);
    } finally {
      // Clear playing state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isPlaying: false }
          : msg
      ));
    }
  }, [messages, voiceSettings]);

  const toggleVoice = useCallback(() => {
    setVoiceSettings(prev => ({ ...prev, enabled: !prev.enabled }));
    speechService.current.stop();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    speechService.current.stop();
  }, []);

  return {
    messages,
    isLoading,
    error,
    voiceSettings,
    sendMessage,
    playVoice,
    toggleVoice,
    clearError,
    clearChat,
    isVoiceSupported: speechService.current.isSupported()
  };
};