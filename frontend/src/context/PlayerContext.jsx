import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { api } from '../services/api';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [activeVoice, setActiveVoice] = useState('JBFqnCBsd6RMkjVDRZzb'); // George (Default free-tier)
  const [voices, setVoices] = useState([]);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [audioSourceType, setAudioSourceType] = useState('ElevenLabs'); // 'ElevenLabs' or 'BrowserSynthesis'

  const audioRef = useRef(null);
  const speechSynthUtteranceRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 60);
      setIsLoadingAudio(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      console.warn('HTML5 Audio error, switching fallback:', e);
      setIsLoadingAudio(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Fetch verified voices on start
    api.getVoices().then(data => {
      if (data.success && data.voices) {
        setVoices(data.voices);
        if (data.defaultVoiceId) setActiveVoice(data.defaultVoiceId);
      }
    }).catch(err => {
      console.warn('Could not fetch voices list:', err);
    });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Web Speech synthesis fallback player
  const playWithBrowserSynthesis = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Estimate duration for progress bar
    const wordCount = text.split(/\s+/).length;
    const estDuration = Math.max(30, Math.round((wordCount / 140) * 60));
    setDuration(estDuration);

    let timer;
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoadingAudio(false);
      setAudioSourceType('BrowserSynthesis');
      
      let elapsed = 0;
      timer = setInterval(() => {
        elapsed += 0.5;
        setCurrentTime(prev => {
          if (prev >= estDuration) {
            clearInterval(timer);
            return estDuration;
          }
          return elapsed;
        });
      }, 500);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      clearInterval(timer);
      setCurrentTime(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      clearInterval(timer);
      setIsLoadingAudio(false);
    };

    speechSynthUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Play an article
  const playArticle = async (article, voiceIdToUse) => {
    if (!article) return;

    const voice = voiceIdToUse || activeVoice;
    setCurrentArticle(article);
    setIsLoadingAudio(true);
    setCurrentTime(0);

    // Stop current playback
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const script = `${article.title}. ${article.description || ''}`;

    try {
      // Call ElevenLabs TTS via backend
      const blob = await api.fetchTTSAudioBlob(script, article.title, voice);
      
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setAudioBlobUrl(newBlobUrl);
      setAudioSourceType('ElevenLabs');

      if (audioRef.current) {
        audioRef.current.src = newBlobUrl;
        audioRef.current.playbackRate = playbackRate;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoadingAudio(false);
      }
    } catch (err) {
      console.warn('ElevenLabs API unavailable or limit reached. Using browser speech synthesis fallback:', err);
      playWithBrowserSynthesis(script);
    }
  };

  const togglePlay = () => {
    if (!currentArticle) return;

    if (isPlaying) {
      if (audioSourceType === 'ElevenLabs' && audioRef.current) {
        audioRef.current.pause();
      } else if (window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioSourceType === 'ElevenLabs' && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      } else if (window.speechSynthesis) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        playArticle(currentArticle);
      }
    }
  };

  const seek = (timeInSeconds) => {
    if (audioSourceType === 'ElevenLabs' && audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    } else {
      setCurrentTime(timeInSeconds);
    }
  };

  const skip = (seconds) => {
    if (audioSourceType === 'ElevenLabs' && audioRef.current) {
      const newTime = Math.min(Math.max(0, audioRef.current.currentTime + seconds), duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const changeVoice = (voiceId) => {
    setActiveVoice(voiceId);
    if (currentArticle && isPlaying) {
      playArticle(currentArticle, voiceId);
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentArticle,
      isPlaying,
      isLoadingAudio,
      currentTime,
      duration,
      playbackRate,
      activeVoice,
      voices,
      audioSourceType,
      isFullPlayerOpen,
      playArticle,
      togglePlay,
      seek,
      skip,
      changePlaybackRate,
      changeVoice,
      setIsFullPlayerOpen,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
