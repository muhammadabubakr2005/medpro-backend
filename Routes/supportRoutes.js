const express = require('express');
const router = express.Router();
const supportController = require('../Controllers/supportController');
const { verifyToken } = require('../Middlewares/auth.middleware');

router.post('/', verifyToken, supportController.submitRequest);
//Admin routes
// router.get('/', verifyToken, supportController.getAllRequests);
// router.put('/:id/status', verifyToken, supportController.updateRequestStatus);

module.exports = router;