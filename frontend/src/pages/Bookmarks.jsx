import React, { useState, useEffect } from 'react';
import { Bookmark, Sparkles, Volume2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import NewsCard from '../components/NewsCard/NewsCard';

export const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBookmarks();
      if (data.success && data.bookmarks) {
        setBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.warn('Load bookmarks error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-editorial text-3xl font-medium text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-400 fill-current" />
            Saved Audio Stories
          </h1>
          <p className="text-xs text-nuzio-muted mt-1">
            Your personal collection of news briefings ({bookmarks.length})
          </p>
        </div>

        <button
          onClick={loadBookmarks}
          className="p-2 rounded-full bg-nuzio-subtle hover:bg-nuzio-card-hover border border-nuzio-border text-nuzio-muted hover:text-white transition"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="h-28 rounded-2xl bg-nuzio-subtle/50 animate-pulse border border-nuzio-border/40" />
            ))}
          </div>
        ) : bookmarks.length > 0 ? (
          bookmarks.map((bm) => (
            <NewsCard key={bm.id || bm.articleId} article={bm} isBookmarked={true} />
          ))
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl p-6">
            <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mx-auto mb-3">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No saved stories yet</h3>
            <p className="text-xs text-nuzio-muted mt-1 max-w-xs mx-auto">
              Tap the bookmark icon on any news story in your feed to save it for listening later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
