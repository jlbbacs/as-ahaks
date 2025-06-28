import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={disabled || isLoading}
              rows={1}
              className="
                w-full px-4 py-3 rounded-2xl border border-gray-300 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                resize-none outline-none transition-all duration-200
                disabled:bg-gray-100 disabled:cursor-not-allowed
                max-h-32 min-h-[48px]
              "
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className="
              p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 
              text-white shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 hover:from-blue-600 hover:to-blue-700
              flex items-center justify-center min-w-[48px]
            "
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};