const express= require('express');
const router= express.Router();
const categoryController= require('../Controllers/categoryController');

router.get('/findall', categoryController.getAllCategories);
router.get('/', categoryController.getCategory);
// router.get('/:name', categoryController.getCategoryByName);

module.exports= router;