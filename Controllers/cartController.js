const CartItem= require('../Models/cartModel');
const Medicine= require('../Models/medicineModel');

exports.getCart = async (req, res) => {
    try {
      const items = await CartItem.find({ userId: req.user.id }).populate('medicineId');
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart', error });
    }
  };
  
  exports.addToCart = async (req, res) => {
    try {
      const { medicineId, quantity,variantIndex } = req.body;
      const existing = await CartItem.findOne({ userId: req.user.id, medicineId });
      if (existing) {
        existing.quantity += quantity;
        await existing.save();
        return res.json({ message: 'Cart item updated', item: existing });
      }
      const med=await Medicine.findById(medicineId);
      const variants=med.variants;
      // console.log(variants);
      const price=variants[variantIndex].price;
      const mg=variants[variantIndex].mg;
      
      const item = new CartItem({ userId: req.user.id, medicineId, quantity ,variant:{price,mg} });
      await item.save();
      res.status(201).json({ message: 'Added to cart', item });
    } catch (error) {
      res.status(500).json({ message: 'Error adding to cart', error });
    }
  };
  
  exports.updateCartItem = async (req, res) => {
    try {
      const { quantity } = req.body;
      console.log(req.params.id);
      const item = await CartItem.findByIdAndUpdate(req.params.itemId, { quantity }, { new: true });
      if (!item) return res.status(404).json({ message: 'Cart item not found' });
      res.json({ message: 'Cart item updated', item });
    } catch (error) {
      console.log(error.stack);
      res.status(500).json({ message: 'Error updating cart item', error });
    }
  };
  
  exports.removeCartItem = async (req, res) => {
    try {
      const deleted = await CartItem.findByIdAndDelete(req.params.itemId);
      if (!deleted) return res.status(404).json({ message: 'Cart item not found' });
      res.json({ message: 'Cart item removed' });
    } catch (error) {
      console.log(error.stack);
      res.status(500).json({ message: 'Error removing cart item', error });
    }
  };
  
  // exports.clearCart = async (req, res) => {
  //   try {
  //     await CartItem.deleteMany({ userId: req.user.id });
  //     res.json({ message: 'Cart cleared' });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error clearing cart', error });
  //   }
  // };
  