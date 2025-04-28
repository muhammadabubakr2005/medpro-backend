const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const { verifyToken } = require('../Middlewares/auth.middleware');


router.post('/', verifyToken, orderController.placeOrder);
//getorder History
router.get('/orders', verifyToken, orderController.getOrderHistory);
// router.get('/user', verifyToken, orderController.getUserOrders);
//admin routes
// router.get('/', verifyToken, orderController.getAllOrders);
// router.get('/:id', verifyToken, orderController.getOrderById);

module.exports = router;