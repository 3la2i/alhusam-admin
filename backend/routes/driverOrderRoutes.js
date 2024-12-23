const express = require('express');
const router = express.Router();
const driverOrderController = require('../controllers/driverOrderController');
const { driverAuth } = require('../middleware/authMiddleware');

// All routes are prefixed with /api/driver/orders
router.get('/available', driverAuth, driverOrderController.getAvailableOrders);
router.get('/active', driverAuth, driverOrderController.getActiveOrders);
router.post('/:orderId/accept', driverAuth, driverOrderController.acceptOrder);
router.patch('/:orderId/status', driverAuth, driverOrderController.updateOrderStatus);

module.exports = router;