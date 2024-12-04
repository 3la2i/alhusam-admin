const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');

// Route is prefixed with /api/auth
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;  