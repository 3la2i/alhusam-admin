const Request = require('../models/Request');

const requestController = {
  getAllRequests: async (req, res) => {
    try {
      const requests = await Request.find()
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      res.status(500).json({ message: 'Error fetching requests' });
    }
  },

  updateRequestStatus: async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;

      const request = await Request.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );

      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }

      res.json(request);
    } catch (error) {
      console.error('Error updating request status:', error);
      res.status(500).json({ message: 'Error updating request status' });
    }
  }
};

module.exports = requestController; 