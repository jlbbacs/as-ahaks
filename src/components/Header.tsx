import React from 'react';
import { MessageSquare, Settings, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  voiceEnabled, 
  onToggleVoice, 
  onOpenSettings 
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
               Erza
              </h1>
              <p className="text-sm text-gray-600">
               Chat JLB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleVoice}
              className={`
                p-3 rounded-xl transition-all duration-200 shadow-sm
                ${voiceEnabled 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-200 shadow-sm"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};