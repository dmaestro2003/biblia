const express = require('express');
const Score = require('../models/Score');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all scores (Admin only)
router.get('/scores', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ message: 'Error fetching scores' });
  }
});

// Get statistics (Admin only)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalScores = await Score.countDocuments();
    const totalQuestions = await require('../models/Question').countDocuments();
    const averageScore = await Score.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);

    res.json({
      totalScores,
      totalQuestions,
      averageScore: averageScore[0]?.avgScore || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;

