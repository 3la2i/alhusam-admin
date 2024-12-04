const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'driver@example.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }
 
    // Create admin user
    const hashedPassword = await bcrypt.hash('driver', 10);
    
    const adminUser = new User({
      username: 'driver',
      email: 'driver@example.com',
      password: hashedPassword,
      role: 'driver',
      isActivated: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser(); 