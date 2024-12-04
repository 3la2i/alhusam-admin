const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { adminAuth } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/admin/requests
router.get('/', adminAuth, requestController.getAllRequests);
router.patch('/:requestId/status', adminAuth, requestController.updateRequestStatus);

module.exports = router; 