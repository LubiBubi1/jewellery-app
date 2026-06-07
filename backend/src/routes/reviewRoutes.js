const express = require('express');
const router = express.Router();
const { createReview, getReviews, getAllReviews, deleteReview } = require('../controllers/reviewController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getReviews);

// Customer routes
router.post('/', protect, createReview);

// Admin routes
router.get('/all', protect, isAdmin, getAllReviews);
router.delete('/:id', protect, isAdmin, deleteReview);

module.exports = router;