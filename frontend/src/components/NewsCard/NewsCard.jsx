import React, { useState } from 'react';
import { Play, Pause, Bookmark, Volume2, Loader2, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { api } from '../../services/api';
import AudioWaveform from '../ui/AudioWaveform';

export const NewsCard = ({ article, isBookmarked: initialBookmarked = false }) => {
  const { currentArticle, isPlaying, playArticle, togglePlay, isLoadingAudio } = usePlayer();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);

  const isThisArticleActive = currentArticle && (currentArticle.id === article.id || currentArticle.title === article.title);
  const isThisPlaying = isThisArticleActive && isPlaying;
  const isThisLoading = isThisArticleActive && isLoadingAudio;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isThisArticleActive) {
      togglePlay();
    } else {
      playArticle(article);
    }
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    try {
      setIsSavingBookmark(true);
      const res = await api.toggleBookmark(article);
      if (res.success) {
        setIsBookmarked(res.isBookmarked);
      }
    } catch (err) {
      console.warn('Bookmark error:', err);
    } finally {
      setIsSavingBookmark(false);
    }
  };

  const formattedTime = () => {
    if (!article.publishedAt) return 'Just now';
    const date = new Date(article.publishedAt);
    const diffMins = Math.round((Date.now() - date.getTime()) / (1000 * 60));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
  };

  return (
    <div
      onClick={handlePlayClick}
      className={`glass-card rounded-2xl p-4 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
        isThisArticleActive
          ? 'border-purple-500/60 bg-purple-950/20 shadow-glow-purple'
          : 'hover:border-nuzio-border-light'
      }`}
    >
      {/* Top row: Source & Bookmark */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/40">
            {article.category || 'Trending'}
          </span>
          <span className="text-[11px] text-nuzio-muted truncate max-w-[140px]">
            {article.source?.name || 'News Wire'} • {formattedTime()}
          </span>
        </div>

        <button
          onClick={handleBookmarkClick}
          disabled={isSavingBookmark}
          className={`p-1.5 rounded-lg transition ${
            isBookmarked
              ? 'text-purple-400 bg-purple-500/20'
              : 'text-nuzio-muted hover:text-white hover:bg-white/5'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Save story'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center content with thumbnail */}
      <div className="flex gap-3.5 items-start">
        <div className="flex-1">
          <h4 className="font-editorial text-lg leading-snug font-medium text-white group-hover:text-purple-200 transition-colors line-clamp-2">
            {article.title}
          </h4>
          <p className="text-xs text-nuzio-muted mt-1.5 line-clamp-2 leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Thumbnail */}
        {article.image && (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-nuzio-subtle border border-nuzio-border relative">
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom controls: Audio play button & Waveform */}
      <div className="mt-3.5 pt-3 border-t border-nuzio-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePlayClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm ${
              isThisPlaying
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-glow-purple'
            }`}
          >
            {isThisLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isThisPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
            <span>{isThisLoading ? 'Synthesizing...' : isThisPlaying ? 'Listening' : 'Listen'}</span>
          </button>

          <span className="text-[11px] text-nuzio-dim font-medium">
            {article.audioDuration || '1:30'}
          </span>
        </div>

        {/* Waveform indicator if playing */}
        {isThisArticleActive && (
          <div className="h-5 flex items-center">
            <AudioWaveform isPlaying={isThisPlaying} barCount={12} height={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
