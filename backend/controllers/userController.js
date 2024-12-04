const User = require('../models/user');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ isDeleted: false })
        .select('-password -otp -otpExpiry')
        .sort({ createdAt: -1 });
      
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },

  // Toggle user activation status
  toggleUserStatus: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.isActivated = !user.isActivated;
      await user.save();

      res.json({
        id: user._id,
        isActivated: user.isActivated
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      res.status(500).json({ message: 'Error updating user status' });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId)
        .select('-password -otp -otpExpiry');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user details' });
    }
  },

  // Update user role
  updateUserRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      console.log(`Updating user ${userId} to role ${role}`);
      
      // Validate role
      const validRoles = ['user', 'provider', 'driver', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.role = role;
      await user.save();

      res.json({
        id: user._id,
        role: user.role
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Error updating user role' });
    }
  },
};

module.exports = userController;
