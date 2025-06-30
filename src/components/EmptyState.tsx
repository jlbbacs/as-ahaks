import React from 'react';
import { MessageSquare, Zap, Volume2 } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Welcome to Erza AI Assistant
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Start a conversation with our AI assistant. Ask questions, get help, or just chat!
        </p>
        
        {/* <div className="grid grid-cols-1 gap-4 text-left">
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-200">
            <Zap className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900">Fast Responses</h3>
              <p className="text-sm text-gray-600">Get instant AI-powered answers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-200">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900">Voice Playback</h3>
              <p className="text-sm text-gray-600">Listen to responses with text-to-speech</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};