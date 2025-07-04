import React, { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { ApiKeyGuide } from './components/ApiKeyGuide';
import { useChat } from './hooks/useChat';
import { AI_CONFIG } from './config/ai';

function App() {
  const {
    messages,
    isLoading,
    error,
    voiceSettings,
    sendMessage,
    playVoice,
    toggleVoice,
    clearError,
    isVoiceSupported
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if error is API-related
  const isApiError = error && (
    error.includes('Rate limit exceeded') || 
    error.includes('Invalid API key') ||
    error.includes('Access forbidden') ||
    error.includes('API request failed')
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <Header 
        voiceEnabled={voiceSettings.enabled && isVoiceSupported}
        onToggleVoice={toggleVoice}
      />
      
      <main className="flex flex-col h-[calc(100vh-80px)]">
        {error && (
          <ErrorMessage message={error} onDismiss={clearError} />
        )}
        
        <div className="flex-1 overflow-y-auto">
          {isApiError ? (
            <div className="max-w-4xl mx-auto px-4 py-6">
              <ApiKeyGuide error={error} provider={AI_CONFIG.provider} />
            </div>
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onPlayVoice={playVoice}
                  voiceEnabled={voiceSettings.enabled && isVoiceSupported}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <MessageInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;