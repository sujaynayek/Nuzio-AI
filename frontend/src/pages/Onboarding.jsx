import React, { useState } from "react";
import {
  Sparkles,
  Radio,
  Check,
  ArrowRight,
  Volume2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { api } from "../services/api";

const AVAILABLE_TOPICS = [
  {
    id: "Artificial Intelligence",
    label: "Artificial Intelligence",
    emoji: "🤖",
  },
  { id: "Technology", label: "Technology & Gadgets", emoji: "💻" },
  { id: "Markets", label: "Markets & Finance", emoji: "📈" },
  { id: "Startups", label: "Startups & Venture Capital", emoji: "🚀" },
  { id: "Science", label: "Science & Space", emoji: "🔬" },
  { id: "World", label: "Global Affairs", emoji: "🌍" },
  { id: "Business", label: "Business & Economy", emoji: "💼" },
  { id: "Health", label: "Biotech & Health", emoji: "🧬" },
];

const AVAILABLE_LANGUAGES = [
  { id: "en", label: "English" },
  { id: "hi", label: "Hindi" },
];

export const Onboarding = ({ onComplete }) => {
  const { user, updatePreferences } = useAuth();
  const { voices, activeVoice, changeVoice } = usePlayer();

  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState(user?.preferences?.language || "en");
  const [selectedTopics, setSelectedTopics] = useState(
    user?.preferences?.topics || [
      "Artificial Intelligence",
      "Technology",
      "Markets",
    ],
  );
  const [selectedVoice, setSelectedVoice] = useState(
    user?.preferences?.preferredVoice || activeVoice || "JBFqnCBsd6RMkjVDRZzb",
  );
  const [auditioningId, setAuditioningId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId],
    );
  };

  const handleAudition = async (voice, e) => {
    e.stopPropagation();
    try {
      setAuditioningId(voice.id);
      const blob = await api.previewVoiceAudioBlob(voice.id);
      const audio = new Audio(URL.createObjectURL(blob));
      audio.onended = () => setAuditioningId(null);
      audio.onerror = () => setAuditioningId(null);
      await audio.play();
    } catch (err) {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(
          voice.sampleQuote || `Hi, I am ${voice.name}`,
        );
        u.onend = () => setAuditioningId(null);
        window.speechSynthesis.speak(u);
      } else {
        setAuditioningId(null);
      }
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    changeVoice(selectedVoice);
    await updatePreferences({
      topics: selectedTopics,
      preferredVoice: selectedVoice,
      language,
      onboardingComplete: true,
    });
    setIsLoading(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-between p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md mx-auto w-full pt-4 relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-purple">
            <Radio className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-base">
            NUZIO AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? "w-6 bg-purple-500 shadow-glow-purple"
                  : step > s
                    ? "w-2 bg-purple-800"
                    : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full my-auto py-8 relative z-10">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Step 1 of 4
              </span>
              <h2 className="font-editorial text-3xl text-white font-medium mt-1">
                Choose your language
              </h2>
              <p className="text-xs text-nuzio-muted mt-1">
                Set the default narration language for your audio briefings.
              </p>
            </div>

            <div className="space-y-3">
              {AVAILABLE_LANGUAGES.map((option) => {
                const isSelected = language === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setLanguage(option.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-purple-950/50 border-purple-500 shadow-glow-purple text-white"
                        : "bg-nuzio-subtle border-nuzio-border text-nuzio-muted hover:text-white hover:bg-nuzio-card-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-purple-300" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-sm gradient-btn-purple shadow-glow-purple flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Step 2 of 4
              </span>
              <h2 className="font-editorial text-3xl text-white font-medium mt-1">
                What interests you?
              </h2>
              <p className="text-xs text-nuzio-muted mt-1">
                Choose your preferred news categories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {AVAILABLE_TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                      isSelected
                        ? "bg-purple-950/50 border-purple-500 shadow-glow-purple text-white"
                        : "bg-nuzio-subtle border-nuzio-border text-nuzio-muted hover:text-white hover:bg-nuzio-card-hover"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{topic.emoji}</span>
                      <span className="text-xs font-semibold">
                        {topic.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedTopics.length === 0}
                className="w-2/3 py-3 rounded-xl gradient-btn-purple text-xs font-bold text-white shadow-glow-purple disabled:opacity-50"
              >
                Continue ({selectedTopics.length})
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Step 3 of 4
              </span>
              <h2 className="font-editorial text-3xl text-white font-medium mt-1">
                Choose your voice
              </h2>
              <p className="text-xs text-nuzio-muted mt-1">
                Select the speaker you want for your audio digest.
              </p>
            </div>

            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {voices.slice(0, 5).map((v) => {
                const isSelected = selectedVoice === v.id;
                const isAuditioning = auditioningId === v.id;

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-purple-950/50 border-purple-500 shadow-glow-purple"
                        : "bg-nuzio-subtle border-nuzio-border hover:bg-nuzio-card-hover"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                        {v.avatar || "🎙️"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {v.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-purple-300">
                            {v.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-nuzio-muted line-clamp-1 mt-0.5">
                          {v.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleAudition(v, e)}
                        className={`p-2 rounded-lg text-xs transition ${
                          isAuditioning
                            ? "bg-purple-600 text-white animate-pulse"
                            : "bg-white/5 hover:bg-white/10 text-nuzio-muted hover:text-white"
                        }`}
                        title="Audition"
                      >
                        {isAuditioning ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-xl gradient-btn-purple text-xs font-bold text-white shadow-glow-purple"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Step 4 of 4
              </span>
              <h2 className="font-editorial text-3xl text-white font-medium mt-1">
                Confirm your setup
              </h2>
              <p className="text-xs text-nuzio-muted mt-1">
                Review your preferences before entering the personalized feed.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-nuzio-border bg-nuzio-subtle p-4 text-sm text-nuzio-muted">
              <div className="flex justify-between gap-3">
                <span>Language</span>
                <span className="font-semibold text-white">
                  {AVAILABLE_LANGUAGES.find((opt) => opt.id === language)
                    ?.label || "English"}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Topics</span>
                <span className="font-semibold text-white text-right">
                  {selectedTopics.join(", ")}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Voice</span>
                <span className="font-semibold text-white text-right">
                  {voices.find((v) => v.id === selectedVoice)?.name ||
                    "Default Voice"}
                </span>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={isLoading}
                className="w-2/3 py-3 rounded-xl gradient-btn-purple text-xs font-bold text-white shadow-glow-purple flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Launch Feed</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto w-full text-center relative z-10 pb-2">
        <span className="text-[11px] text-nuzio-dim">
          Personalized AI news • manual sign in only
        </span>
      </div>
    </div>
  );
};

export default Onboarding;
