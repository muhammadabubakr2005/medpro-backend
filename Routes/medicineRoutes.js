const express = require('express');
const router = express.Router();
const medicineController = require('../Controllers/medicineController');
const {upload} = require('../Middlewares/bulkUpload');

// Public
router.get('/search', medicineController.searchMedicinesByName);
router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);
// Protected (Admin)
router.post('/', medicineController.addMedicine);
router.put('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);
router.post('/upload',upload.single('file'), medicineController.bulkUploadMedicines);

module.exports = router;


