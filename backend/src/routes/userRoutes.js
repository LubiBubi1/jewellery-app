const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getUsers);
router.put('/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;