const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for leaderboard queries
scoreSchema.index({ score: -1, createdAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);

