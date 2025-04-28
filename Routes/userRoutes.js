const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { verifyToken } = require('../Middlewares/auth.middleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);


// router.get('/orders', verifyToken, userController.getOrderHistory);

// Protected routes
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.put('/change-password', verifyToken, userController.changePassword);
// router.get('/', verifyToken, userController.getAllUsers);
// router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
