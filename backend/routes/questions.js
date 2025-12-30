const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get random questions by level (Public - for quiz)
router.get('/random/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const count = parseInt(req.query.count) || 10;

    if (!['Easy', 'Medium', 'Hard'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level. Must be Easy, Medium, or Hard' });
    }

    const questions = await Question.aggregate([
      { $match: { level } },
      { $sample: { size: count } },
      { $project: { correctAnswer: 0 } } // Don't send correct answer to client
    ]);

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Get all questions (Admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching all questions:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
});

// Verify answer (Public - for quiz)
router.post('/verify/:id', async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = answer === question.correctAnswer;
    
    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      bibleVerse: question.bibleVerse
    });
  } catch (error) {
    console.error('Error verifying answer:', error);
    res.status(500).json({ message: 'Error verifying answer' });
  }
});

// Get single question by ID (Admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Error fetching question' });
  }
});

// Create question (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { question, options, correctAnswer, level, bibleVerse } = req.body;

    if (!question || !options || !correctAnswer || !level || !bibleVerse) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Must provide exactly 4 options' });
    }

    if (!['Easy', 'Medium', 'Hard'].includes(level)) {
      return res.status(400).json({ message: 'Invalid level' });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
      level,
      bibleVerse
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Error creating question' });
  }
});

// Update question (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { question, options, correctAnswer, level, bibleVerse } = req.body;

    const updateData = {};
    if (question) updateData.question = question;
    if (options) {
      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ message: 'Must provide exactly 4 options' });
      }
      updateData.options = options;
    }
    if (correctAnswer) updateData.correctAnswer = correctAnswer;
    if (level) {
      if (!['Easy', 'Medium', 'Hard'].includes(level)) {
        return res.status(400).json({ message: 'Invalid level' });
      }
      updateData.level = level;
    }
    if (bibleVerse) updateData.bibleVerse = bibleVerse;

    // Validate correct answer is in options
    if (correctAnswer && options && !options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must be one of the options' });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Error updating question' });
  }
});

// Delete question (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
});

module.exports = router;

