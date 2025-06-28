import React from 'react';
import { Message } from '../types';
import { User, Bot, Volume2, VolumeX } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onPlayVoice?: (messageId: string) => void;
  voiceEnabled: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onPlayVoice, 
  voiceEnabled 
}) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-start gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[70%] group ${isUser ? 'order-first' : ''}`}>
        <div className={`
          px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm
          ${isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto' 
            : 'bg-white/80 text-gray-800 border border-gray-200'
          }
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        <div className={`
          flex items-center gap-2 mt-2 text-xs text-gray-500
          ${isUser ? 'justify-end' : 'justify-start'}
        `}>
          <span>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {!isUser && voiceEnabled && onPlayVoice && (
            <button
              onClick={() => onPlayVoice(message.id)}
              className={`
                p-1.5 rounded-full transition-all duration-200 hover:bg-gray-200
                ${message.isPlaying ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}
              `}
              title="Play voice"
            >
              {message.isPlaying ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};