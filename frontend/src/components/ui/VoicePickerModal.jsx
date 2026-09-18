import React, { useState } from 'react';
import { X, Check, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { api } from '../../services/api';

export const VoicePickerModal = ({ isOpen, onClose }) => {
  const { voices, activeVoice, changeVoice } = usePlayer();
  const [auditioningVoiceId, setAuditioningVoiceId] = useState(null);
  const [audioPreviewEl, setAudioPreviewEl] = useState(null);

  if (!isOpen) return null;

  const handleAudition = async (voice, e) => {
    e.stopPropagation();
    try {
      if (audioPreviewEl) {
        audioPreviewEl.pause();
      }

      setAuditioningVoiceId(voice.id);
      const blob = await api.previewVoiceAudioBlob(voice.id);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setAudioPreviewEl(audio);
      
      audio.onended = () => {
        setAuditioningVoiceId(null);
      };
      audio.onerror = () => {
        setAuditioningVoiceId(null);
      };

      await audio.play();
    } catch (err) {
      console.warn('Voice preview error:', err);
      // Fallback web speech preview
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(voice.sampleQuote || `Hi, I am ${voice.name}`);
        u.onend = () => setAuditioningVoiceId(null);
        window.speechSynthesis.speak(u);
      } else {
        setAuditioningVoiceId(null);
      }
    }
  };

  const handleSelect = (voiceId) => {
    changeVoice(voiceId);
    if (audioPreviewEl) audioPreviewEl.pause();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-nuzio-card border border-nuzio-border rounded-2xl p-6 shadow-card max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-nuzio-border">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-nuzio-accent" />
              Choose AI News Anchor
            </h3>
            <p className="text-xs text-nuzio-muted mt-0.5">
              Verified free-tier ElevenLabs neural voices
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-nuzio-muted hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voice List */}
        <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
          {voices.map((v) => {
            const isSelected = activeVoice === v.id;
            const isAuditioning = auditioningVoiceId === v.id;

            return (
              <div
                key={v.id}
                onClick={() => handleSelect(v.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-glow-purple'
                    : 'bg-nuzio-subtle/70 border-nuzio-border hover:bg-nuzio-card-hover hover:border-nuzio-border-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${
                    isSelected ? 'bg-purple-600/30 ring-2 ring-purple-400' : 'bg-white/5'
                  }`}>
                    {v.avatar || '🎙️'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{v.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-purple-300 font-medium">
                        {v.tag}
                      </span>
                    </div>
                    <p className="text-xs text-nuzio-muted line-clamp-1 mt-0.5">
                      {v.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audition button */}
                  <button
                    onClick={(e) => handleAudition(v, e)}
                    title="Audition sample voice"
                    className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                      isAuditioning
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-white/5 hover:bg-white/15 text-nuzio-muted hover:text-white'
                    }`}
                  >
                    {isAuditioning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[11px] hidden sm:inline">Preview</span>
                  </button>

                  {/* Check icon */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-nuzio-border flex items-center justify-between">
          <span className="text-[11px] text-nuzio-dim">Powered by ElevenLabs Flash v2.5</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoicePickerModal;
