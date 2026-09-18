/**
 * Curated list of ElevenLabs Free-Tier Verified Voices
 * Tested and verified with model: eleven_flash_v2_5
 */
const VERIFIED_VOICES = [
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    gender: 'male',
    tag: 'Warm & Captivating',
    category: 'General News',
    accent: 'British / Mid-Atlantic',
    description: 'Crisp, trustworthy voice ideal for general news briefings and morning roundups.',
    sampleQuote: "Good morning. Here is your daily briefing from Nuzio AI.",
    avatar: '🎙️',
    isDefault: true
  },
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice',
    gender: 'female',
    tag: 'Clear & Engaging',
    category: 'Tech & Culture',
    accent: 'British / Clear',
    description: 'Bright, articulate delivery perfect for technology deep-dives and cultural stories.',
    sampleQuote: "Welcome back. Let's dive into today's breakthrough tech stories.",
    avatar: '✨'
  },
  {
    id: 'nPczCjzI2devNBz1zQrb',
    name: 'Brian',
    gender: 'male',
    tag: 'Deep & Resonant',
    category: 'Finance & Markets',
    accent: 'American / Classic',
    description: 'Authoritative, calm tone designed for financial summaries and market movements.',
    sampleQuote: "Market close overview: tech stocks rebound as inflation cool down.",
    avatar: '📈'
  },
  {
    id: 'cgSgspJ2msm6clMCkdW9',
    name: 'Jessica',
    gender: 'female',
    tag: 'Playful & Bright',
    category: 'Startups & Trends',
    accent: 'American / Youthful',
    description: 'Energetic, modern narration built for fast-paced startup and trending stories.',
    sampleQuote: "Catch up in 60 seconds with what everyone is talking about.",
    avatar: '⚡'
  },
  {
    id: 'FGY2WhTYpPnrIDTdsKH5',
    name: 'Laura',
    gender: 'female',
    tag: 'Calm & Soothing',
    category: 'Digest & Lifestyle',
    accent: 'American / Gentle',
    description: 'Relaxed pacing and warm tone, ideal for long evening listening sessions.',
    sampleQuote: "Here are the top stories you might have missed today.",
    avatar: '🌙'
  },
  {
    id: 'SAz9YHcvj6GT2YYXdXww',
    name: 'River',
    gender: 'neutral',
    tag: 'Confident & Crisp',
    category: 'Breaking News',
    accent: 'Contemporary',
    description: 'Punchy and neutral pace crafted for urgent headlines and rapid alerts.',
    sampleQuote: "Breaking alert: global leaders reach landmark summit agreement.",
    avatar: '🌐'
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    gender: 'male',
    tag: 'Authoritative & Bold',
    category: 'World Politics',
    accent: 'British / Deep',
    description: 'Distinguished news anchor voice with exceptional clarity and presence.',
    sampleQuote: "From our international desk, here are the key diplomatic updates.",
    avatar: '🏛️'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    gender: 'female',
    tag: 'Natural & Expressive',
    category: 'Science & Health',
    accent: 'American / Conversational',
    description: 'Natural flow and relatable cadence for science, health, and lifestyle.',
    sampleQuote: "New study reveals significant progress in clean energy storage.",
    avatar: '🧬'
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    gender: 'male',
    tag: 'Clear & Confident',
    category: 'Executive Summary',
    accent: 'American / Neutral',
    description: 'Clear cadence for quick executive executive digests and commute listening.',
    sampleQuote: "Your five-minute executive summary is ready.",
    avatar: '💼'
  }
];

const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George

module.exports = {
  VERIFIED_VOICES,
  DEFAULT_VOICE_ID,
  TTS_MODEL_ID: 'eleven_flash_v2_5' // Fast, supported on Free Tier!
};
