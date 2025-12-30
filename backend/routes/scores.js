const express = require('express');
const Score = require('../models/Score');

const router = express.Router();

// Submit score (Public - for players)
router.post('/', async (req, res) => {
  try {
    const { playerName, score, level } = req.body;

    if (!playerName || score === undefined || !level) {
      return res.status(400).json({ message: 'Player name, score, and level are required' });
    }

    if (!['Easy', 'Medium', 'Hard'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level' });
    }

    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ message: 'Score must be a non-negative number' });
    }

    const newScore = new Score({
      playerName: playerName.trim(),
      score,
      level
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ message: 'Error saving score' });
  }
});

// Get leaderboard (Top 10 only - Public)
router.get('/leaderboard', async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ score: -1, createdAt: -1 })
      .limit(10)
      .select('playerName score level createdAt');

    res.json(topScores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;

