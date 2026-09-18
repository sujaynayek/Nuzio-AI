const axios = require('axios');
const { VERIFIED_VOICES, DEFAULT_VOICE_ID, TTS_MODEL_ID } = require('../config/voices');

// Simple cache for generated TTS audio to save ElevenLabs character quota
const audioCache = new Map();

// @desc    Get List of Verified Free-Tier ElevenLabs Voices
// @route   GET /api/audio/voices
const getVoices = (req, res) => {
  return res.json({
    success: true,
    defaultVoiceId: DEFAULT_VOICE_ID,
    count: VERIFIED_VOICES.length,
    voices: VERIFIED_VOICES
  });
};

// @desc    Generate and Stream TTS Audio from ElevenLabs
// @route   POST /api/audio/tts
const generateTTS = async (req, res) => {
  try {
    const { text, title, voiceId = DEFAULT_VOICE_ID } = req.body;

    if (!text && !title) {
      return res.status(400).json({ success: false, message: 'Text or title is required for audio synthesis.' });
    }

    // Build the script: an engaging news anchor opening + the content
    const script = text 
      ? (text.length > 500 ? text.slice(0, 500) + '...' : text)
      : title;

    // Use selected voice or fallback to default George
    const targetVoice = VERIFIED_VOICES.find(v => v.id === voiceId) ? voiceId : DEFAULT_VOICE_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_ba259367a70cb83ca324d3fd895087ca091bf86b8c28d0e6';

    const cacheKey = `${targetVoice}_${script.slice(0, 100)}`;
    if (audioCache.has(cacheKey)) {
      const cachedBuffer = audioCache.get(cacheKey);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': cachedBuffer.length,
        'Cache-Control': 'public, max-age=86400',
        'X-Audio-Source': 'Cache'
      });
      return res.send(cachedBuffer);
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoice}`;

    const response = await axios({
      method: 'POST',
      url: elevenLabsUrl,
      data: {
        text: script,
        model_id: TTS_MODEL_ID, // 'eleven_flash_v2_5'
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      },
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      timeout: 15000
    });

    const audioBuffer = Buffer.from(response.data);

    // Cache the audio buffer (store up to 50 items)
    if (audioCache.size > 50) {
      const firstKey = audioCache.keys().next().value;
      audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, audioBuffer);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400',
      'X-Audio-Source': 'ElevenLabs'
    });

    return res.send(audioBuffer);

  } catch (error) {
    console.error('ElevenLabs TTS Error:', error.response?.data ? error.response.data.toString() : error.message);
    
    // Return friendly error response so client player can switch to browser speech synthesis seamlessly
    return res.status(error.response?.status || 500).json({
      success: false,
      fallbackToSpeechSynthesis: true,
      message: 'ElevenLabs generation unavailable or character limit reached. Switching to native synthesizer.'
    });
  }
};

// @desc    Generate quick voice sample preview
// @route   POST /api/audio/preview
const previewVoice = async (req, res) => {
  try {
    const { voiceId } = req.body;
    const voice = VERIFIED_VOICES.find(v => v.id === voiceId) || VERIFIED_VOICES[0];
    const previewText = voice.sampleQuote || `Hi, I am ${voice.name}, your personalized AI news anchor on Nuzio AI.`;

    req.body.text = previewText;
    req.body.voiceId = voice.id;
    return generateTTS(req, res);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Preview failed' });
  }
};

module.exports = {
  getVoices,
  generateTTS,
  previewVoice
};
