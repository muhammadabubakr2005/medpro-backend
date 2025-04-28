const express = require('express');
const router = express.Router();
const deliveryController = require('../Controllers/deliveryController');
const { verifyToken } = require('../Middlewares/auth.middleware');


router.get('/', deliveryController.getDeliveries);
router.post('/', deliveryController.assignDelivery);
router.put('/:id/status', deliveryController.updateDeliveryStatus);
// router.get('/user', deliveryController.getUserDeliveries);
router.get('/status',verifyToken, deliveryController.getDeliveryStatus);

module.exports = router;