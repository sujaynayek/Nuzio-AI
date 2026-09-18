import React, { useState } from 'react';
import { Search, TrendingUp, Sparkles, Compass, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import NewsCard from '../components/NewsCard/NewsCard';

const TRENDING_SEARCHES = [
  'Artificial Intelligence',
  'Semiconductors',
  'Space Exploration',
  'Nuclear Fusion',
  'Cybersecurity',
  'Biotech',
  'Autonomous Vehicles'
];

const DISCOVER_CHANNELS = [
  { name: 'AI Frontier', query: 'Artificial Intelligence', emoji: '🤖', color: 'from-purple-900/60 to-indigo-950/60' },
  { name: 'Markets & Crypto', query: 'Markets', emoji: '📈', color: 'from-emerald-950/60 to-teal-950/60' },
  { name: 'Deep Tech & Chips', query: 'Semiconductors', emoji: '⚡', color: 'from-blue-950/60 to-cyan-950/60' },
  { name: 'Climate & Fusion', query: 'Clean Energy', emoji: '☀️', color: 'from-amber-950/60 to-orange-950/60' }
];

export const Discover = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchTerm) => {
    const term = searchTerm || query;
    if (!term || term.trim() === '') return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await api.getNews({ search: term });
      if (data.success && data.articles) {
        setSearchResults(data.articles);
      }
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="pb-28 max-w-4xl mx-auto px-4 pt-4 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-editorial text-3xl font-medium text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-purple-400" />
          Discover & Search
        </h1>
        <p className="text-xs text-nuzio-muted mt-1">
          Explore global topics and listen to AI audio stories
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-nuzio-dim absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search any topic, technology, company..."
          className="w-full bg-nuzio-card border border-nuzio-border focus:border-purple-500 rounded-2xl pl-11 pr-24 py-3 text-xs text-white placeholder-nuzio-dim outline-none shadow-sm transition"
        />
        <button
          onClick={() => handleSearch()}
          disabled={isSearching}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl gradient-btn-purple text-xs font-semibold text-white shadow-glow-purple flex items-center gap-1.5"
        >
          {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          <span>Search</span>
        </button>
      </div>

      {/* Trending Search Chips */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-nuzio-muted mb-2.5">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <span>Trending Queries</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                handleSearch(term);
              }}
              className="px-3 py-1.5 rounded-xl bg-nuzio-subtle hover:bg-nuzio-card-hover border border-nuzio-border text-xs text-nuzio-muted hover:text-white transition"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-nuzio-muted">
            Results ({searchResults.length})
          </h3>
          {isSearching ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-24 rounded-2xl bg-nuzio-subtle/50 animate-pulse border border-nuzio-border/40" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((art, idx) => (
                <NewsCard key={art.id || idx} article={art} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-nuzio-muted py-4">No stories found for "{query}".</p>
          )}
        </div>
      )}

      {/* Channels Grid */}
      {!hasSearched && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-nuzio-muted">
            Curated Audio Channels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISCOVER_CHANNELS.map((ch) => (
              <div
                key={ch.name}
                onClick={() => {
                  setQuery(ch.query);
                  handleSearch(ch.query);
                }}
                className={`p-4 rounded-2xl border border-nuzio-border hover:border-purple-500/40 cursor-pointer bg-gradient-to-br ${ch.color} transition-all duration-200 hover:scale-[1.02] flex items-center justify-between`}
              >
                <div>
                  <span className="text-2xl mb-1 block">{ch.emoji}</span>
                  <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                  <span className="text-[11px] text-nuzio-muted">Tap to listen</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
