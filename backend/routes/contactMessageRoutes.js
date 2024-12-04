const express = require('express');
const router = express.Router();
const contactMessageController = require('../controllers/contactMessageController');
const { adminAuth } = require('../middleware/authMiddleware');

router.get('/', adminAuth, contactMessageController.getAllMessages);
router.patch('/:messageId/status', adminAuth, contactMessageController.updateMessageStatus);

module.exports = router; 