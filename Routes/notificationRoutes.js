const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const { verifyToken } = require('../Middlewares/auth.middleware');

router.get('/', verifyToken, notificationController.getNotifications);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.post('/', notificationController.createNotification);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;