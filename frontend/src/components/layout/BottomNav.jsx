import React from 'react';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const BottomNav = ({ activeTab, onTabChange }) => {
  const { currentArticle } = usePlayer();

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass-nav pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around py-2.5 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-4 rounded-xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-purple-400 font-semibold'
                  : 'text-nuzio-muted hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-glow-purple" />
                )}
              </div>
              <span className="text-[10px] tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
