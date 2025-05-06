const categoryModel = require('../Models/categoryModel');
// const Medicine = require('../Models/medicineModel');
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
}

exports.getCategory = async (req, res) => {
    try {
        const {name = null,  id = null} = req.query;

        if(!name && !id) throw new Error('Please provide a name or category to search for category.');

        let searchQuery = name
        ? { name } 
        : { id };
        // const category = await categoryModel.find(searchQuery).populate('medicineIds');
        const categoryDoc = await categoryModel.findOne(searchQuery).populate('medicineIds');
        const category = categoryDoc?.toObject(); // converts Mongoose doc to plain JSON object

        if (category.length === 0) {
        return res.status(404).json({ message: `No categories found matching: ${name}` });
        }
        
        res.json(category.medicineIds); 
        // console.log("Category found:", category);
        // res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
}

// exports.getCategoryByName = async (req, res) =>{
//     try {
//         debugger;
//         const { name } = req.params;
//         console.log("Looking for category with name:", req.params.name);
//         const category = await categoryModel.findOne({name});
        
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }

//         res.json(category);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// }