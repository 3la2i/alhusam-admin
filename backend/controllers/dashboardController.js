const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const ProviderApplication = require('../models/providerApplication');

const dashboardController = {
  getStats: async (req, res) => {
    try {
      // Get counts
      const usersCount = await User.countDocuments({ isDeleted: false });
      const providersCount = await ProviderApplication.countDocuments({ status: 'مقبول' });
      const productsCount = await Product.countDocuments({ isDeleted: false });
      
      // Get users by role
      const usersByRole = await User.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);

      // Get products by category
      const productsByCategory = await Product.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      // Get total sales and recent orders
      const orders = await Order.find()
        .populate('user', 'username')
        .populate('provider', 'fullName')
        .populate('driver', 'username')
        .sort({ createdAt: -1 })
        .limit(5);

      const totalSales = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]);

      // Format the response
      const stats = {
        users: usersCount,
        providers: providersCount,
        products: productsCount,
        totalSales: totalSales[0]?.total || 0,
        usersByRole: usersByRole.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, { user: 0, provider: 0, driver: 0, admin: 0 }),
        productsByCategory: productsByCategory.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {
          'مصنوعات يدوية': 0,
          'ملابس': 0,
          'طعام': 0,
          'أكسسوارات': 0,
          'أخرى': 0
        }),
        recentOrders: orders
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
  }
};

module.exports = dashboardController; 