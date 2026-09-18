import React from 'react';

export const TopicPill = ({ label, active = false, onClick, count, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap active:scale-95 ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow-purple border border-purple-400/30 font-semibold'
          : 'bg-nuzio-subtle hover:bg-nuzio-card-hover text-nuzio-muted hover:text-white border border-nuzio-border'
      }`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
      {count && (
        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-black/30 text-nuzio-dim'}`}>
          {count}
        </span>
      )}
    </button>
  );
};

export default TopicPill;
