const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length === 4;
      },
      message: 'Question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  bibleVerse: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);

