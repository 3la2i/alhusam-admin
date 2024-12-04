const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { adminAuth } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/admin/users
router.get('/', adminAuth, userController.getAllUsers);
router.get('/:userId', adminAuth, userController.getUserById);
router.patch('/:userId/toggle-status', adminAuth, userController.toggleUserStatus);
router.patch('/:userId/role', adminAuth, userController.updateUserRole);

module.exports = router; 