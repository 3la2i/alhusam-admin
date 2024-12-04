
// testimonialController.js
const Testimonial = require('../models/Testimonial');

const testimonialController = {
  getAllTestimonials: async (req, res) => {
    try {
      const testimonials = await Testimonial.find()
        .sort({ createdAt: -1 });
      
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ message: 'Error fetching testimonials' });
    }
  },

  toggleTestimonialStatus: async (req, res) => {
    try {
      const { testimonialId } = req.params;
      
      const testimonial = await Testimonial.findById(testimonialId);
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      testimonial.isActive = !testimonial.isActive;
      await testimonial.save();

      res.json(testimonial);
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      res.status(500).json({ message: 'Error updating testimonial status' });
    }
  }
};

module.exports = testimonialController; 