const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/bookmarks/toggle', toggleBookmark);
router.get('/bookmarks', getBookmarks);

module.exports = router;
