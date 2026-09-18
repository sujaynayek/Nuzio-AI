import React from 'react';
import { Play, Pause, Radio, Sparkles, Loader2, Volume2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import AudioWaveform from '../ui/AudioWaveform';

export const HeroCard = ({ article }) => {
  const { currentArticle, isPlaying, playArticle, togglePlay, isLoadingAudio, activeVoice, voices } = usePlayer();

  if (!article) return null;

  const isThisArticleActive = currentArticle && (currentArticle.id === article.id || currentArticle.title === article.title);
  const isThisPlaying = isThisArticleActive && isPlaying;
  const isThisLoading = isThisArticleActive && isLoadingAudio;

  const currentVoiceObj = voices.find(v => v.id === activeVoice) || { name: 'George' };

  const handlePlayClick = () => {
    if (isThisArticleActive) {
      togglePlay();
    } else {
      playArticle(article);
    }
  };

  return (
    <div 
      onClick={handlePlayClick}
      className="relative rounded-3xl overflow-hidden p-6 cursor-pointer border border-purple-500/40 bg-gradient-to-br from-[#1A1829] via-[#13141E] to-[#0D0E15] shadow-glow-purple group transition-all duration-300 hover:border-purple-400/60"
    >
      {/* Background ambient glow circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

      {/* Top badges */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-[11px] font-bold text-red-400 uppercase tracking-wider">
            <Radio className="w-3 h-3 animate-pulse text-red-400" />
            Breaking Briefing
          </span>
          <span className="text-xs text-purple-300 font-medium">
            {article.category || 'Artificial Intelligence'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-nuzio-muted">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Voiced by {currentVoiceObj.name}</span>
        </div>
      </div>

      {/* Headline */}
      <div className="relative z-10 my-2">
        <h3 className="font-editorial text-2xl sm:text-3xl text-white font-medium leading-tight group-hover:text-purple-100 transition-colors">
          {article.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed font-normal">
          {article.description}
        </p>
      </div>

      {/* Action footer */}
      <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition shadow-lg active:scale-95"
          >
            {isThisLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : isThisPlaying ? (
              <Pause className="w-4 h-4 fill-current text-black" />
            ) : (
              <Play className="w-4 h-4 fill-current text-black ml-0.5" />
            )}
            <span>{isThisLoading ? 'Synthesizing Audio...' : isThisPlaying ? 'Playing Story' : 'Listen Now'}</span>
          </button>

          <span className="text-xs text-nuzio-muted font-medium">
            {article.audioDuration || '2:15'}
          </span>
        </div>

        {/* Real-time audio waveform equalizer */}
        <div className="h-6 flex items-center">
          <AudioWaveform isPlaying={isThisPlaying} barCount={16} height={22} color="#8B5CF6" />
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
