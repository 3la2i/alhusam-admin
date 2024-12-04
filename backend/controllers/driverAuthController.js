const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const driverAuthController = {
  driverLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for:', email);

      const user = await User.findOne({ email });
      
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.role !== 'driver') {
        console.log('User is not a driver:', email);
        return res.status(401).json({ message: 'Account is not a driver account' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('driverToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        driver: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  },

  driverLogout: async (req, res) => {
    res.cookie('driverToken', '', { maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
  }
};

module.exports = driverAuthController; 