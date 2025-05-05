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

// exports.getCategoryByName = async (req, res) =>{
//     try {
//         console.log("Looking for category with name:", req.params.name);
//         const category = await categoryModel.findOne({ name: req.params.name });
        
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }

//         res.json(category);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// }