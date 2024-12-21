const Order = require('../models/order');
const ProviderApplication = require('../models/providerApplication');

const driverOrderController = {
  // Get all available orders (pending status)
  getAvailableOrders: async (req, res) => {
    try {
      // Fetch orders with the specified conditions and populate necessary fields
      const orders = await Order.find({
        driverStatus: 'pending',
        providerStatus: 'ready',
        driver: { $exists: false }
      })
      .populate('user', 'username email')
      // .populate('provider', 'fullName email phoneNumber address')
      .populate({
        path: 'items.product',
        select: 'title titleAr price mainImage',
        match: { isDeleted: false }
      })
      .sort({ createdAt: -1 });

      // Fetch provider details for each order
      const ordersWithProviders = await Promise.all(
        orders.map(async (order) => {
          const provider = await ProviderApplication.findOne({
            userId: order.provider, // Match provider in Order with userId in ProviderApplication
          }).select("email fullName phoneNumber address");

          return {
            ...order.toObject(),
            provider, // Attach the fetched provider data to the order
          };
        })
      );

      // Send the populated orders with provider data
      console.log(ordersWithProviders);
      res.status(200).json(ordersWithProviders);
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

      .populate({
        path: 'items.product',
        select: 'title titleAr price mainImage',
        match: { isDeleted: false }
      })
      .sort({ createdAt: -1 });

      // Fetch provider details for each order
      const ordersWithProviders = await Promise.all(
        activeOrders.map(async (order) => {
          const provider = await ProviderApplication.findOne({
            userId: order.provider, // Match provider in Order with userId in ProviderApplication
          }).select("email fullName phoneNumber address");

          return {
            ...order.toObject(),
            provider, // Attach the fetched provider data to the order
          };
        })
      );

      // Send the populated orders with provider data
      console.log(ordersWithProviders);
      res.status(200).json(ordersWithProviders);
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