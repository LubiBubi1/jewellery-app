const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Admin only routes
router.post('/', protect, isAdmin, createService);
router.put('/:id', protect, isAdmin, updateService);
router.delete('/:id', protect, isAdmin, deleteService);

module.exports = router;