const Medicine = require('../Models/medicineModel');
const Category = require('../Models/categoryModel');

const xlsx = require('xlsx');

exports.getAllMedicines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const medicines = await Medicine.find().skip(skip).limit(limit);
    const total = await Medicine.countDocuments();

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      medicines,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines', error });
  }
};

// GET one medicine
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine', error });
  }
};

// POST add medicine
exports.addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine({ ...req.body});
    await medicine.save();

    // Handle categories
    if (req.body.categories && req.body.categories.length > 0) {
      for (const catName of req.body.categories) {
        let category = await Category.findOne({ name: catName });

        if (category) {
          // If category exists, add the new medicine ID if not already present
          if (!category.medicineIds.includes(medicine._id)) {
            category.medicineIds.push(medicine._id);
            await category.save();
          }
        } else {
          // If category does not exist, create a new one
          const newCategory = new Category({
            name: catName,
            medicineIds: [medicine._id]
          });
          await newCategory.save();
        }
      }
    }

    res.status(201).json({ message: 'Medicine added and categories updated', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error });
  }
};

// PUT update medicine
exports.updateMedicine = async (req, res) => {
  try {
    if(req.body.categories){delete req.body.categories;}
    if(req.body.name){delete req.body.name;}
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // if(updated.name){delete updated.name;}
    // if(updated.categories){
    //   delete updated.categories;
    // }

    if (!updated) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Medicine updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error });
  }
};

// DELETE medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medicine', error });
  }
};
// GET medicines by category
exports.getMedicinesByCategory = async (req, res) => {
  try {
    const category = req.params.categoryName;

    const medicines = await Medicine.find({ categories: { $in: [category] } });

    if (medicines.length === 0) {
      return res.status(404).json({ message: `No medicines found in category: ${category}` });
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines by category', error });
  }
};

// Search medicines by name
exports.searchMedicinesByName = async (req, res) => {
  try {
    const {name = null, category = null} = req.query;

    if(!name && !category) throw new Error('Please provide a name or category to search for medicines.');

    let searchQuery = name
      ? { name: { $regex: name, $options: 'i' } } 
      : { categories: {$regex: category, $options: 'i' } };
    const medicines = await Medicine.find(searchQuery);

    if (medicines.length === 0) {
      return res.status(404).json({ message: `No medicines found matching: ${name}` });
    }

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error searching medicines by name', error });
  }
};

exports.bulkUploadMedicines = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read Excel/CSV file buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Transform data
    const medicines = jsonData.map((item) => ({
      name: item.name,
      categories: item.categories ? item.categories.split(',').map(cat => cat.trim()) : [],
      // price: item.price,
      // stock: item.stock,
      variants: item.variants ? item.variants.split(',').map(variant => {
        const [price, stock, mg] = variant.split('|').map(value => value.trim());
        return { price: parseFloat(price), stock: parseInt(stock), mg: parseInt(mg) };
      }) : [],
      description: item.description || '',
      // mg: item.mg ? item.mg.split(',').map(cat => cat.trim()) : [],
      imageUrl: item.imageUrl || '',
    }));

    // Insert into DB
    const savedMedicines = await Medicine.insertMany(medicines);

    for (const medicine of savedMedicines) {
      if (medicine.categories && medicine.categories.length > 0) {
        for (const catName of medicine.categories) {
          let category = await Category.findOne({ name: catName });

          if (category) {
            // Category exists - add medicine ID if not already present
            if (!category.medicineIds.includes(medicine._id)) {
              category.medicineIds.push(medicine._id);
              await category.save();
            }
          } else {
            // Category does not exist - create it
            const newCategory = new Category({
              name: catName,
              medicineIds: [medicine._id]
            });
            await newCategory.save();
          }
        }
      }
    }

    res.status(201).json({ message: 'Bulk upload successful and categories updated', count: savedMedicines.length });
   } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
};