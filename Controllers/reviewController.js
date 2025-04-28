const Review = require('../Models/reviewModel');

exports.addReview = async (req, res) => {
    try {
      const { medicineId, rating, comment } = req.body;
      const review = new Review({ userId: req.user.id, medicineId, rating, comment });
      await review.save();
      res.status(201).json({ message: 'Review added', review });
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error });
    }
  };
  
  exports.getMedicineReviews = async (req, res) => {
    try {
      const reviews = await Review.find({ medicineId: req.params.id }).populate('userId', 'name');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reviews', error });
    }
  };
  
  exports.getUserReviews = async (req, res) => {
    try {
      const reviews = await Review.find({ userId: req.user.id });
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user reviews', error });
    }
  };
  
  exports.updateReview = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const updated = await Review.findByIdAndUpdate(req.params.id, { rating, comment }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Review not found' });
      res.json({ message: 'Review updated', updated });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error });
    }
  };
  
  exports.deleteReview = async (req, res) => {
    try {
      const deleted = await Review.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Review not found' });
      res.json({ message: 'Review deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error });
    }
  };