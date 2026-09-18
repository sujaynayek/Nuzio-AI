const Bookmark = require("../models/Bookmark");
const User = require("../models/User");
const { getDBStatus } = require("../config/db");

// In-memory bookmarks cache for fallback
const memoryBookmarks = global._nuzio_memory_bookmarks || new Map();
global._nuzio_memory_bookmarks = memoryBookmarks;

// @desc    Toggle Bookmark on an article
// @route   POST /api/user/bookmarks/toggle
const toggleBookmark = async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id;
    const { article } = req.body;

    if (!article || !article.id) {
      return res
        .status(400)
        .json({ success: false, message: "Article data is required" });
    }

    if (getDBStatus()) {
      const existing = await Bookmark.findOne({
        userId,
        articleId: article.id,
      });
      if (existing) {
        await Bookmark.deleteOne({ _id: existing._id });
        return res.json({
          success: true,
          isBookmarked: false,
          message: "Article removed from bookmarks",
        });
      }

      await Bookmark.create({
        userId,
        articleId: article.id,
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.image,
        source: article.source,
        category: article.category,
        publishedAt: article.publishedAt,
        audioDuration: article.audioDuration,
      });

      return res.json({
        success: true,
        isBookmarked: true,
        message: "Article saved to bookmarks",
      });
    }

    // Memory fallback
    const key = `${userId}_${article.id}`;
    if (memoryBookmarks.has(key)) {
      memoryBookmarks.delete(key);
      return res.json({
        success: true,
        isBookmarked: false,
        message: "Article removed from bookmarks",
      });
    }

    memoryBookmarks.set(key, {
      userId,
      articleId: article.id,
      ...article,
      createdAt: new Date(),
    });

    return res.json({
      success: true,
      isBookmarked: true,
      message: "Article saved to bookmarks",
    });
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error toggling bookmark" });
  }
};

// @desc    Get user's bookmarked stories
// @route   GET /api/user/bookmarks
const getBookmarks = async (req, res) => {
  try {
    const userId = req.user._id?.toString() || req.user.id;

    if (getDBStatus()) {
      const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, bookmarks });
    }

    // Memory fallback
    const bookmarks = [];
    for (const [_, bm] of memoryBookmarks) {
      if (bm.userId === userId) {
        bookmarks.push(bm);
      }
    }

    return res.json({ success: true, bookmarks });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching bookmarks" });
  }
};

module.exports = {
  toggleBookmark,
  getBookmarks,
};
