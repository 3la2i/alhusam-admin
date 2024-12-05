const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const providerApplicationRoutes = require('./routes/providerApplicationRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const driverAuthRoutes = require('./routes/driverAuthRoutes');
const driverOrderRoutes = require('./routes/driverOrderRoutes');
const requestRoutes = require('./routes/requestRoutes');
const contactMessageRoutes = require('./routes/contactMessageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, Node.js Project!');
});

// Use route files
app.use('/api/auth', authRoutes);                              // Auth routes
app.use('/api/admin/users', userRoutes);                       // User routes
app.use('/api/admin/provider-applications', providerApplicationRoutes); // Provider application routes
app.use('/api/admin/testimonials', testimonialRoutes);         // Testimonial routes
app.use('/api/driver/auth', driverAuthRoutes);                 // Driver auth routes
app.use('/api/driver/orders', driverOrderRoutes);              // Driver order routes
app.use('/api/admin/requests', requestRoutes);                 // Request routes
app.use('/api/admin/contact-messages', contactMessageRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Connected successfully to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch(err => console.error('MongoDB connection error:', err));
