const { Review, User } = require('../models');

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    
    const existingReview = await Review.findOne({
      where: { productId, userId: req.user.id },
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating,
      title,
      comment,
    });
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    await review.update(req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
