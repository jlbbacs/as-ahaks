import React, { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { useChat } from './hooks/useChat';

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
          {messages.length === 0 ? (
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