const express = require('express');
const router = express.Router();
const prescriptionController = require('../Controllers/prescriptionController');
const { verifyToken } = require('../Middlewares/auth.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// router.post('/upload', verifyToken,upload.single('file'), prescriptionController.uploadPrescription);
router.get('/user', verifyToken, prescriptionController.getUserPrescriptions);

//admin routes
// router.get('/', verifyToken, checkAdmin, prescriptionController.getAllPrescriptions);

module.exports = router;