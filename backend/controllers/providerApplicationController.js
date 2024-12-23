const ProviderApplication = require('../models/providerApplication');
const User = require('../models/user');
const Product = require('../models/product');

const providerApplicationController = {
  getAllApplications: async (req, res) => {
    try {
      const applications = await ProviderApplication.find()
        .populate('userId', 'username email role')
        .sort({ createdAt: -1 });

      res.json(applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Error fetching applications' });
    }
  },

  updateApplicationStatus: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      const application = await ProviderApplication.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      application.status = status;
      await application.save();

      // Update user role based on application status
      const user = await User.findById(application.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (status === 'مقبول') {
        user.role = 'provider';
      } else if (status === 'مرفوض' || status === 'قيد المراجعة') {
        // Only change role back to user if they're currently a provider
        if (user.role === 'provider') {
          user.role = 'user';
        }
      }

      await user.save();

      // Return updated application with populated user
      const updatedApplication = await ProviderApplication.findById(applicationId)
        .populate('userId', 'username email role');

      res.json(updatedApplication);
    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({ message: 'Error updating application status' });
    }
  },

  getProviderProducts: async (req, res) => {
    console.log('Received request for provider products');
    console.log('Request body:', req.body);
    try {
      const { providerIds } = req.body;

      if (!providerIds || !Array.isArray(providerIds)) {
        console.log('Invalid providerIds:', providerIds);
        return res.status(400).json({ message: 'Invalid provider IDs' });
      }

      console.log('Searching for products with provider IDs:', providerIds);
      const products = await Product.find({
        seller: { $in: providerIds },
        isDeleted: false
      }).populate('seller', 'username email');

      console.log('Found products:', products);
      res.json(products);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ message: 'Error fetching provider products', error: error.message });
    }
  }
};

module.exports = providerApplicationController;