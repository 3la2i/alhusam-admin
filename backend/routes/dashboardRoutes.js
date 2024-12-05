const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { adminAuth } = require('../middleware/authMiddleware');

router.get('/stats', adminAuth, dashboardController.getStats);
router.get('/provider-stats', adminAuth, dashboardController.getProviderStats);

module.exports = router; 