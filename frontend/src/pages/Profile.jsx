import React, { useState } from "react";
import {
  User,
  Sparkles,
  Volume2,
  Settings,
  LogOut,
  Check,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import VoicePickerModal from "../components/ui/VoicePickerModal";

const ALL_TOPICS = [
  "Artificial Intelligence",
  "Technology",
  "Markets",
  "Startups",
  "Science",
  "World",
  "Business",
  "Health",
];

export const Profile = ({ onOpenLogin }) => {
  const { user, logout, updatePreferences } = useAuth();
  const { activeVoice, voices } = usePlayer();
  const [isVoicePickerOpen, setIsVoicePickerOpen] = useState(false);

  const currentVoiceObj = voices.find((v) => v.id === activeVoice) || {
    name: "George",
    tag: "Warm & Captivating",
    avatar: "🎙️",
    description: "Crisp, trustworthy voice ideal for general news briefings.",
  };

  const userTopics = user?.preferences?.topics || [
    "Artificial Intelligence",
    "Technology",
    "Markets",
  ];

  const toggleTopic = async (topic) => {
    const nextTopics = userTopics.includes(topic)
      ? userTopics.filter((t) => t !== topic)
      : [...userTopics, topic];

    await updatePreferences({ topics: nextTopics });
  };

  const handleLogout = async () => {
    await logout();
    onOpenLogin?.();
  };

  return (
    <>
      <div className="pb-28 max-w-4xl mx-auto px-4 pt-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-editorial text-3xl font-medium text-white flex items-center gap-2">
            <User className="w-6 h-6 text-purple-400" />
            Profile & Settings
          </h1>
          <p className="text-xs text-nuzio-muted mt-1">
            Manage your AI news preferences and audio settings
          </p>
        </div>

        {/* User Card */}
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between border border-nuzio-border">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-glow-purple flex items-center justify-center text-white font-extrabold text-xl">
              {user?.name ? user.name[0].toUpperCase() : "G"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  {user?.name || "User"}
                </h3>
              </div>
              <p className="text-xs text-nuzio-muted mt-0.5">
                {user?.email || "user@nuzio.ai"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-nuzio-muted hover:text-red-400 transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Preferred AI Voice Anchor Card */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-nuzio-muted">
            Preferred AI Voice Anchor
          </h3>
          <div
            onClick={() => setIsVoicePickerOpen(true)}
            className="glass-card rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/60 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-800/50 flex items-center justify-center text-2xl">
                {currentVoiceObj.avatar || "🎙️"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {currentVoiceObj.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-medium">
                    {currentVoiceObj.tag}
                  </span>
                </div>
                <p className="text-xs text-nuzio-muted mt-0.5 line-clamp-1">
                  {currentVoiceObj.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
              <span>Change</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Topic Preferences */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-wider text-nuzio-muted">
              Interest Topics
            </h3>
            <span className="text-[11px] text-nuzio-dim">Tap to toggle</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_TOPICS.map((topic) => {
              const isSelected = userTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-purple-600/30 border-purple-500 text-white font-semibold"
                      : "bg-nuzio-subtle border-nuzio-border text-nuzio-muted hover:text-white"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Stack & System Info */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-nuzio-muted">
            Platform Specifications
          </h3>
          <div className="glass-card rounded-2xl p-4 border border-nuzio-border space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-nuzio-border/40">
              <span className="text-nuzio-muted">Architecture</span>
              <span className="font-semibold text-white">
                MERN Stack (Decoupled Frontend & Backend)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-nuzio-border/40">
              <span className="text-nuzio-muted">AI Voice Synthesis</span>
              <span className="font-semibold text-purple-300">
                ElevenLabs Flash v2.5 (Free Tier Verified)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-nuzio-border/40">
              <span className="text-nuzio-muted">News Provider</span>
              <span className="font-semibold text-white">GNews API v4</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-nuzio-muted">Database</span>
              <span className="font-semibold text-white">
                MongoDB / Mongoose
              </span>
            </div>
          </div>
        </div>
      </div>

      <VoicePickerModal
        isOpen={isVoicePickerOpen}
        onClose={() => setIsVoicePickerOpen(false)}
      />
    </>
  );
};

export default Profile;
