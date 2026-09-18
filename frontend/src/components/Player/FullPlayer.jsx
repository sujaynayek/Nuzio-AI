import React, { useState } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Bookmark, 
  Sparkles, 
  Volume2, 
  Share2, 
  Loader2,
  ExternalLink 
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { api } from '../../services/api';
import AudioWaveform from '../ui/AudioWaveform';
import VoicePickerModal from '../ui/VoicePickerModal';

export const FullPlayer = () => {
  const {
    currentArticle,
    isPlaying,
    isLoadingAudio,
    togglePlay,
    seek,
    skip,
    currentTime,
    duration,
    playbackRate,
    changePlaybackRate,
    activeVoice,
    voices,
    isFullPlayerOpen,
    setIsFullPlayerOpen,
  } = usePlayer();

  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  if (!isFullPlayerOpen || !currentArticle) return null;

  const currentVoiceObj = voices.find(v => v.id === activeVoice) || { name: 'George', tag: 'Warm & Captivating' };

  const formatTime = (timeInSec) => {
    if (!timeInSec || isNaN(timeInSec)) return '0:00';
    const m = Math.floor(timeInSec / 60);
    const s = Math.floor(timeInSec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSliderChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    changePlaybackRate(speeds[nextIdx]);
  };

  const handleToggleBookmark = async () => {
    try {
      const res = await api.toggleBookmark(currentArticle);
      if (res.success) {
        setIsBookmarked(res.isBookmarked);
      }
    } catch (err) {
      console.warn('Bookmark error:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle.title,
        text: currentArticle.description,
        url: currentArticle.url || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(currentArticle.url || window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#0B0C10] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 p-5 flex items-center justify-between border-b border-nuzio-border/40">
          <button
            onClick={() => setIsFullPlayerOpen(false)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition active:scale-95"
            title="Minimize"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
              AI AUDIO NEWS DIGEST
            </span>
            <div className="text-xs text-nuzio-muted font-medium">
              {currentArticle.category || 'Technology'}
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition active:scale-95"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Center Artwork & Article Information */}
        <div className="relative z-10 max-w-md mx-auto w-full px-6 py-4 flex-1 flex flex-col justify-center">
          {/* Main Cover Image */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-card bg-nuzio-subtle group">
            {currentArticle.image ? (
              <img
                src={currentArticle.image}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-950 via-indigo-950 to-black text-white">
                <span className="text-4xl mb-2">🎙️</span>
                <span className="text-xs text-purple-300 font-medium">Nuzio AI Audio Brief</span>
              </div>
            )}

            {/* Floating Voice Persona Pill */}
            <button
              onClick={() => setIsVoicePickerOpen(true)}
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-white hover:bg-black/80 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Anchor: <strong className="text-purple-300">{currentVoiceObj.name}</strong></span>
            </button>

            {/* Audio Waveform Overlay at bottom of artwork */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isPlaying ? 'animate-ping' : ''}`} />
                {isPlaying ? 'Now Streaming' : 'Ready'}
              </span>
              <AudioWaveform isPlaying={isPlaying} barCount={18} height={20} color="#10B981" />
            </div>
          </div>

          {/* Headline & Source */}
          <div className="mt-6 text-left">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-purple-400">
                {currentArticle.source?.name || 'Global News'}
              </span>
              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded-lg transition ${isBookmarked ? 'text-purple-400 bg-purple-500/20' : 'text-nuzio-muted hover:text-white'}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h2 className="font-editorial text-2xl text-white font-medium leading-snug">
              {currentArticle.title}
            </h2>

            {/* Read Summary Toggle */}
            <div className="mt-3">
              <p className={`text-xs text-slate-300 leading-relaxed ${showFullText ? '' : 'line-clamp-3'}`}>
                {currentArticle.content || currentArticle.description}
              </p>
              <button
                onClick={() => setShowFullText(!showFullText)}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold mt-1"
              >
                {showFullText ? 'Show less' : 'Read full summary script'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Playback & Scrubber Controls */}
        <div className="relative z-10 max-w-md mx-auto w-full px-6 pb-8">
          {/* Progress Bar & Timers */}
          <div className="space-y-1.5 mb-6">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[11px] text-nuzio-muted font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Primary Controls Row */}
          <div className="flex items-center justify-between">
            {/* Speed Button */}
            <button
              onClick={cycleSpeed}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-purple-300 flex items-center justify-center transition active:scale-95"
              title="Playback speed"
            >
              {playbackRate}x
            </button>

            {/* Rewind 15s */}
            <button
              onClick={() => skip(-15)}
              className="p-3 rounded-full hover:bg-white/10 text-white transition active:scale-90"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            {/* Large Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-18 h-18 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-purple-500 p-5 text-white flex items-center justify-center shadow-glow-purple hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {isLoadingAudio ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            {/* Fast Forward 15s */}
            <button
              onClick={() => skip(15)}
              className="p-3 rounded-full hover:bg-white/10 text-white transition active:scale-90"
              title="Skip forward 15 seconds"
            >
              <RotateCw className="w-6 h-6" />
            </button>

            {/* Change Voice Button */}
            <button
              onClick={() => setIsVoicePickerOpen(true)}
              className="w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition active:scale-95"
              title="Switch ElevenLabs Voice"
            >
              <Volume2 className="w-5 h-5 text-purple-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice Selection Modal */}
      <VoicePickerModal
        isOpen={isVoicePickerOpen}
        onClose={() => setIsVoicePickerOpen(false)}
      />
    </>
  );
};

export default FullPlayer;
