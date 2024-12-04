const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { adminAuth } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/admin/testimonials
router.get('/', adminAuth, testimonialController.getAllTestimonials);
router.patch('/:testimonialId/toggle-status', adminAuth, testimonialController.toggleTestimonialStatus);

module.exports = router; 