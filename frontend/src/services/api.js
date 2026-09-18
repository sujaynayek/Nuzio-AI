import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://nuzio-ai-jhmp.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  withCredentials: true,
});

export const api = {
  // ── Auth & User ──
  login: async (credentials) => {
    const res = await apiClient.post("/auth/login", credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await apiClient.post("/auth/register", userData);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post("/auth/logout");
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  updatePreferences: async (preferences) => {
    const res = await apiClient.put("/auth/preferences", preferences);
    return res.data;
  },

  // ── News ──
  getNews: async (params = {}) => {
    const res = await apiClient.get("/news", { params });
    return res.data;
  },

  // ── Audio & TTS (ElevenLabs) ──
  getVoices: async () => {
    const res = await apiClient.get("/audio/voices");
    return res.data;
  },

  generateTTSAudioUrl: (text, title, voiceId) => {
    // Return direct URL for streaming or fetch buffer
    return `${API_BASE_URL}/audio/tts`;
  },

  fetchTTSAudioBlob: async (text, title, voiceId) => {
    const res = await apiClient.post(
      "/audio/tts",
      { text, title, voiceId },
      {
        responseType: "blob",
      },
    );
    return res.data;
  },

  previewVoiceAudioBlob: async (voiceId) => {
    const res = await apiClient.post(
      "/audio/preview",
      { voiceId },
      {
        responseType: "blob",
      },
    );
    return res.data;
  },

  // ── Bookmarks ──
  toggleBookmark: async (article) => {
    const res = await apiClient.post("/user/bookmarks/toggle", { article });
    return res.data;
  },

  getBookmarks: async () => {
    const res = await apiClient.get("/user/bookmarks");
    return res.data;
  },
};

export default apiClient;
