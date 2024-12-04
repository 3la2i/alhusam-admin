const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const ProviderApplication = require('../models/providerApplication');
require('dotenv').config();

const createTestOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get the test customer
    const customer = await User.findOne({ email: 'customer@test.com' });
    if (!customer) {
      throw new Error('Test customer not found. Please run create-test-data first');
    }

    // Get the test provider application
    const provider = await ProviderApplication.findOne({ email: 'provider@test.com', status: 'مقبول' });
    if (!provider) {
      throw new Error('Test provider not found. Please run create-test-data first');
    }

    // Get the test product
    const product = await Product.findOne({ seller: provider.userId });
    if (!product) {
      throw new Error('Test product not found. Please run create-test-data first');
    }

    // Create test order
    const testOrder = new Order({
      user: customer._id,
      provider: provider._id,
      items: [{
        product: product._id,
        quantity: 2,
        price: product.price
      }],
      total: product.price * 2,
      driverStatus: 'pending',
      providerStatus: 'pending',
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345'
      },
      firstName: customer.username,
      lastName: 'Test',
      email: customer.email,
      phone: '1234567890',
      info: 'This is a test order',
      paymentMethod: 'cash'
    });

    await testOrder.save();
    console.log('Test order created successfully:', {
      orderId: testOrder._id,
      customer: customer.email,
      provider: provider.email,
      total: testOrder.total
    });

  } catch (error) {
    console.error('Error creating test order:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createTestOrder(); 