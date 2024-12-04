const express = require('express');
const router = express.Router();
const { driverLogin, driverLogout } = require('../controllers/driverAuthController');
const { driverAuth } = require('../middleware/authMiddleware');

// Test route
router.get('/test', driverAuth, (req, res) => {
  res.json({ message: 'Driver authentication working' });
});

router.post('/login', driverLogin);
router.post('/logout', driverLogout);

module.exports = router; 