import React from 'react';

export const AudioWaveform = ({ isPlaying = false, barCount = 18, color = '#10B981', height = 24 }) => {
  // Generate slightly varying static heights for realistic look when paused
  const baseHeights = [30, 65, 45, 80, 95, 60, 40, 75, 85, 50, 90, 70, 35, 60, 85, 40, 75, 55];

  return (
    <div className="flex items-center gap-[3px] h-full py-1">
      {Array.from({ length: barCount }).map((_, i) => {
        const baseH = baseHeights[i % baseHeights.length];
        return (
          <span
            key={i}
            className="w-[3px] rounded-full transition-all duration-300"
            style={{
              height: isPlaying ? undefined : `${Math.max(4, Math.round((baseH / 100) * height))}px`,
              backgroundColor: color,
              animation: isPlaying ? `waveform ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${(i * 0.08).toFixed(2)}s`
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioWaveform;
