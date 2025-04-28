const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/reviewController');
const { verifyToken } = require('../Middlewares/auth.middleware');

router.post('/', verifyToken, reviewController.addReview);
router.get('/medicine/:id', reviewController.getMedicineReviews);
router.get('/user', verifyToken, reviewController.getUserReviews);
router.put('/:id', verifyToken, reviewController.updateReview);
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;