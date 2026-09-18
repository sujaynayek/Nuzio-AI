const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  articleId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  url: String,
  image: String,
  source: {
    name: String,
    url: String,
  },
  category: String,
  publishedAt: String,
  audioDuration: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);
