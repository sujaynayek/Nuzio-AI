import React, { useState } from 'react';
import { Radio, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import VoicePickerModal from '../ui/VoicePickerModal';

export const Header = ({ onNavigate }) => {
  const { user } = useAuth();
  const { activeVoice, voices, isPlaying } = usePlayer();
  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState(false);

  const currentVoiceObj = voices.find(v => v.id === activeVoice) || { name: 'George', avatar: '🎙️' };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-nuzio-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate && onNavigate('feed')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-glow-purple group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
                NUZIO <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">AI</span>
              </span>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Voice Persona Selector Button */}
            <button
              onClick={() => setIsVoicePickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nuzio-subtle hover:bg-nuzio-card-hover border border-nuzio-border text-xs font-medium text-slate-200 transition shadow-sm"
              title="Change ElevenLabs Voice Persona"
            >
              <span className="text-xs">{currentVoiceObj.avatar || '🎙️'}</span>
              <span className="hidden sm:inline text-nuzio-muted">Voice:</span>
              <span className="font-semibold text-purple-300">{currentVoiceObj.name}</span>
              <Sparkles className="w-3 h-3 text-purple-400 ml-0.5" />
            </button>

            {/* Live audio indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-400 font-medium">
              <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isPlaying ? 'animate-ping' : ''}`} />
              <span>Live AI Audio</span>
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => onNavigate && onNavigate('profile')}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:scale-105 transition active:scale-95"
            >
              {user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Voice Selection Modal */}
      <VoicePickerModal
        isOpen={isVoicePickerOpen}
        onClose={() => setIsVoicePickerOpen(false)}
      />
    </>
  );
};

export default Header;
