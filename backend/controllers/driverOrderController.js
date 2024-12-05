const Order = require('../models/order');

const driverOrderController = {
  // Get all available orders (pending status)
  getAvailableOrders: async (req, res) => {
    try {
      const orders = await Order.find({ 
        driverStatus: 'pending',
        driver: { $exists: false }
      })
      .populate('user', 'username email')
      .populate('provider', 'fullName email phoneNumber address')
      .populate('items.product', 'title titleAr price')
      .sort({ createdAt: -1 });
      
      res.json(orders);
    } catch (error) {
      console.error('Error fetching available orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },

  // Get driver's active orders
  getActiveOrders: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const activeOrders = await Order.find({
        driver: driverId,
        driverStatus: { $in: ['accepted', 'ready', 'on the way'] }
      })
      .populate('user', 'username email')
      .populate('provider', 'fullName email phoneNumber address')
      .populate('items.product', 'title titleAr price')
      .sort({ createdAt: -1 });

      res.json(activeOrders);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      res.status(500).json({ message: 'Error fetching active orders' });
    }
  },

  // Accept an order
  acceptOrder: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { orderId } = req.params;

      // Check if driver already has an active order
      const activeOrdersCount = await Order.countDocuments({
        driver: driverId,
        driverStatus: { $in: ['accepted', 'ready', 'on the way'] }
      });

      if (activeOrdersCount >= 1) {
        return res.status(400).json({ 
          message: 'Cannot accept more than 1 active order' 
        });
      }

      const order = await Order.findOneAndUpdate(
        { 
          _id: orderId,
          driverStatus: 'pending',
          driver: { $exists: false }
        },
        { 
          driver: driverId,
          driverStatus: 'accepted'
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ 
          message: 'Order not found or already taken' 
        });
      }

      res.json(order);
    } catch (error) {
      console.error('Error accepting order:', error);
      res.status(500).json({ message: 'Error accepting order' });
    }
  },

  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const driverId = req.user.userId;
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await Order.findOneAndUpdate(
        { 
          _id: orderId,
          driver: driverId
        },
        { driverStatus: status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  }
};

module.exports = driverOrderController; 