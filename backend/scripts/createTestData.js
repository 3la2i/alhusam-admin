const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ProviderApplication = require('../models/providerApplication');
const Product = require('../models/product');
require('dotenv').config();

const createTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Create a test user (customer)
    const customerExists = await User.findOne({ email: 'customer@test.com' });
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('customer123', 10);
      const customer = new User({
        username: 'testCustomer',
        email: 'customer@test.com',
        password: hashedPassword,
        role: 'user',
        isActivated: true
      });
      await customer.save();
      console.log('Test customer created successfully');
    }

    // 2. Create a test provider user
    const providerUserExists = await User.findOne({ email: 'provider@test.com' });
    let providerUser;
    if (!providerUserExists) {
      const hashedPassword = await bcrypt.hash('provider123', 10);
      providerUser = new User({
        username: 'testProvider',
        email: 'provider@test.com',
        password: hashedPassword,
        role: 'provider',
        isActivated: true
      });
      await providerUser.save();
      console.log('Test provider user created successfully');
    } else {
      providerUser = providerUserExists;
    }

    // 3. Create a provider application
    const providerApplicationExists = await ProviderApplication.findOne({ email: 'provider@test.com' });
    let providerApplication;
    if (!providerApplicationExists) {
      providerApplication = new ProviderApplication({
        fullName: 'Test Provider',
        phoneNumber: '1234567890',
        email: 'provider@test.com',
        address: 'Test Address',
        productType: ['مصنوعات يدوية'],
        skillsDescription: 'Test skills description',
        status: 'مقبول',
        userId: providerUser._id
      });
      await providerApplication.save();
      console.log('Test provider application created successfully');
    } else {
      providerApplication = providerApplicationExists;
    }

    // 4. Create a test product
    const productExists = await Product.findOne({ seller: providerUser._id });
    if (!productExists) {
      const product = new Product({
        title: 'Test Product',
        titleAr: 'منتج تجريبي',
        seller: providerUser._id,
        description: 'Test product description',
        mainImage: 'https://example.com/test-image.jpg',
        price: 100,
        category: 'مصنوعات يدوية',
        stock: 10,
        isActive: true
      });
      await product.save();
      console.log('Test product created successfully');
    }

    console.log('All test data created successfully');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestData(); 