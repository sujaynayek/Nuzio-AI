const express = require('express');
const router = express.Router();
const { getVoices, generateTTS, previewVoice } = require('../controllers/audioController');

router.get('/voices', getVoices);
router.post('/tts', generateTTS);
router.post('/preview', previewVoice);

module.exports = router;
