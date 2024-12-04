const ContactMessage = require('../models/ContactMessage');

const contactMessageController = {
  getAllMessages: async (req, res) => {
    try {
      const messages = await ContactMessage.find()
        .sort({ date: -1 });
      
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  },

  updateMessageStatus: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { status } = req.body;
      
      const message = await ContactMessage.findByIdAndUpdate(
        messageId,
        { status },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.json(message);
    } catch (error) {
      console.error('Error updating message status:', error);
      res.status(500).json({ message: 'Error updating message status' });
    }
  }
};

module.exports = contactMessageController; 