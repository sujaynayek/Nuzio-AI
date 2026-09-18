import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Radio, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { api } from '../services/api';
import TopicPill from '../components/ui/TopicPill';
import HeroCard from '../components/NewsCard/HeroCard';
import NewsCard from '../components/NewsCard/NewsCard';

const CATEGORIES = [
  'All',
  'Artificial Intelligence',
  'Technology',
  'Markets',
  'Startups',
  'Science',
  'Business'
];

export const Feed = () => {
  const { user } = useAuth();
  const { activeVoice, voices } = usePlayer();

  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentVoiceObj = voices.find(v => v.id === activeVoice) || { name: 'George', tag: 'Warm & Captivating' };

  const loadNews = async (cat = activeCategory) => {
    try {
      setIsLoading(true);
      const data = await api.getNews({ category: cat });
      if (data.success && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.warn('Failed to load news feed:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(activeCategory);
  }, [activeCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadNews(activeCategory);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const heroArticle = articles.length > 0 ? articles[0] : null;
  const feedArticles = articles.length > 1 ? articles.slice(1) : articles;

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-4 space-y-6">
      {/* Greeting & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-white tracking-tight">
              {getGreeting()}, <span className="italic text-purple-300">{user?.name?.split(' ')[0] || 'Explorer'}</span>
            </h1>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-xs text-nuzio-muted mt-1">
            Your personalized audio news dispatch • Voiced by <strong className="text-purple-300 font-semibold">{currentVoiceObj.name}</strong>
          </p>
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-nuzio-subtle hover:bg-nuzio-card-hover border border-nuzio-border text-xs text-nuzio-muted hover:text-white transition"
          title="Refresh headlines"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Featured Breaking Hero Card */}
      {heroArticle && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <HeroCard article={heroArticle} />
        </div>
      )}

      {/* Topic Filter Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => (
          <TopicPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Article List Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold tracking-wider text-nuzio-muted">
            Today's Audio Stories ({feedArticles.length})
          </h3>
          <span className="text-[11px] text-nuzio-dim">
            Tap Listen to stream
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 rounded-2xl bg-nuzio-subtle/50 animate-pulse border border-nuzio-border/40" />
            ))}
          </div>
        ) : feedArticles.length > 0 ? (
          <div className="space-y-3.5">
            {feedArticles.map((article, idx) => (
              <NewsCard key={article.id || idx} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-2xl p-6">
            <Radio className="w-8 h-8 text-nuzio-dim mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No stories found for this category</p>
            <p className="text-xs text-nuzio-muted mt-1">Try switching categories or refreshing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
