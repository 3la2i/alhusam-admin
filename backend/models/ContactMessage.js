// models/ContactMessage.js
const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  }
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

module.exports = ContactMessage;
