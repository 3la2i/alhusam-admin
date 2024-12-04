const express = require('express');
const router = express.Router();
const providerApplicationController = require('../controllers/providerApplicationController');
const { adminAuth } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/admin/provider-applications
router.get('/', adminAuth, providerApplicationController.getAllApplications);
router.patch('/:applicationId/status', adminAuth, providerApplicationController.updateApplicationStatus);
router.post('/products', adminAuth, providerApplicationController.getProviderProducts);

module.exports = router; 