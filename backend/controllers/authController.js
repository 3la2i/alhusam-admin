const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!['admin', 'driver'].includes(user.role)) {
      console.log('Invalid role for user:', email);
      return res.status(401).json({ message: 'Account does not have required permissions' });
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

    // Set cookie based on role
    const cookieName = user.role === 'admin' ? 'adminToken' : 'driverToken';
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
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
};

const logout = async (req, res) => {
  try {
    // Clear both types of tokens to ensure complete logout
    res.cookie('adminToken', '', { maxAge: 0 });
    res.cookie('driverToken', '', { maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
};

module.exports = { login, logout }; 