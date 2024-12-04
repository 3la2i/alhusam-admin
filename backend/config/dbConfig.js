
const mongoose = require('mongoose'); // Import mongoose
// MongoDB connection URI
const uri = 'mongodb+srv://alaaata25:alaaata87@cluster0.6hmfl.mongodb.net/adminPanel?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected successfully to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});
