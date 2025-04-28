const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');
const { verifyToken } = require('../Middlewares/auth.middleware');

router.get('/', verifyToken, cartController.getCart);
router.post('/', verifyToken, cartController.addToCart);
router.put('/:itemId', verifyToken, cartController.updateCartItem);
router.delete('/:itemId', verifyToken, cartController.removeCartItem);
// router.delete('/clear', verifyToken, cartController.clearCart);


module.exports = router;
