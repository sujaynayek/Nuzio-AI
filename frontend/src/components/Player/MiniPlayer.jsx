import React from 'react';
import { Play, Pause, FastForward, Maximize2, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import AudioWaveform from '../ui/AudioWaveform';

export const MiniPlayer = () => {
  const {
    currentArticle,
    isPlaying,
    isLoadingAudio,
    togglePlay,
    skip,
    setIsFullPlayerOpen,
    currentTime,
    duration,
  } = usePlayer();

  if (!currentArticle) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={() => setIsFullPlayerOpen(true)}
      className="fixed bottom-[64px] left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-30 cursor-pointer glass-panel rounded-2xl p-2.5 border border-purple-500/40 shadow-card hover:border-purple-400/70 transition-all duration-300"
    >
      {/* Top progress line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden rounded-t-2xl">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Title */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-nuzio-subtle flex-shrink-0 border border-nuzio-border">
            {currentArticle.image ? (
              <img src={currentArticle.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-purple-300 bg-purple-950">
                🎙️
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-white truncate">
              {currentArticle.title}
            </h5>
            <p className="text-[10px] text-nuzio-muted truncate">
              {currentArticle.source?.name || 'Nuzio Audio'} • AI News Briefing
            </p>
          </div>
        </div>

        {/* Center: Waveform mini */}
        <div className="hidden xs:flex h-5 items-center flex-shrink-0">
          <AudioWaveform isPlaying={isPlaying} barCount={8} height={16} color="#A855F7" />
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => skip(15)}
            className="p-1.5 rounded-full hover:bg-white/10 text-nuzio-muted hover:text-white transition"
            title="Skip forward 15s"
          >
            <FastForward className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-glow-purple transition active:scale-95"
          >
            {isLoadingAudio ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
