const express= require('express');
const router= express.Router();
const categoryController= require('../Controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

module.exports= router;