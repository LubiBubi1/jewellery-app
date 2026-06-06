const express = require('express');
const router = express.Router();
const { createServiceRequest, getMyServiceRequests, getAllServiceRequests, updateServiceRequestStatus } = require('../controllers/serviceRequestController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createServiceRequest);
router.get('/my', protect, getMyServiceRequests);

// Admin routes
router.get('/', protect, isAdmin, getAllServiceRequests);
router.put('/:id/status', protect, isAdmin, updateServiceRequestStatus);

module.exports = router;