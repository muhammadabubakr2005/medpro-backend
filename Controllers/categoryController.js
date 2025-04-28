const categoryModel = require('../Models/categoryModel');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
}
