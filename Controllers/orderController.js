const Order = require('../Models/orderModel');
const Medicine = require('../Models/medicineModel');
exports.placeOrder = async (req, res) => {
  try {
    const { medicines, deliveryAddress, paymentStatus } = req.body;
    if (!medicines || medicines.length === 0 || !deliveryAddress || !paymentStatus) {
      return res.status(400).json({ message: 'Medicines, delivery address, and payment status are required.' });
    }
    let totalAmount = 0;
    for (const item of medicines) {
      
      const medicine = await Medicine.findById(item.medicineId);
      
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.medicineId}` });
      }

      const variant = medicine.variants[item.variantIndex];
      
      if (!variant) {
        return res.status(400).json({ message: `Variant with index ${variantIndex} not found for this medicine.` });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for medicine: ${medicine.name}` });
      }
      medicine.variants[item.variantIndex].stock -= item.quantity;
      await medicine.save();

      totalAmount += variant.price * item.quantity;
    }

    const order = new Order({
      userId: req.user.id,
      medicines: medicines,
      totalAmount,
      deliveryAddress,
      paymentStatus
    });

    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order', error });
  }
};

exports.getOrderHistory = async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.id }).populate('medicines.medicineId');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order history', error });
    }
  };
  
//   exports.getUserOrders = async (req, res) => {
//     try {
//       const orders = await Order.find({ userId: req.user.id }).populate('medicines.medicineId');
//       res.json(orders);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching user orders', error });
//     }
//   };
  
//   exports.getAllOrders = async (req, res) => {
//     try {
//       const orders = await Order.find().populate('userId', 'name email');
//       res.json(orders);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching orders', error });
//     }
//   };
  
//   exports.getOrderById = async (req, res) => {
//     try {
//       const order = await Order.findById(req.params.id);
//       if (!order) return res.status(404).json({ message: 'Order not found' });
//       res.json(order);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching order', error });
//     }
//   };
  
//   exports.updateOrderStatus = async (req, res) => {
//     try {
//       const { status } = req.body;
//       const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
//       if (!updated) return res.status(404).json({ message: 'Order not found' });
//       res.json({ message: 'Order status updated', updated });
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating order status', error });
//     }
//   };
  