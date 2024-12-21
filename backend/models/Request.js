const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  resume: {
    type: String, // URL to uploaded resume/file
  },
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'completed'],
    default: 'pending',
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  }
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;