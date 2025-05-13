const Order = require('../Models/orderModel');
const Medicine = require('../Models/medicineModel');
const Cart=require('../Models/cartModel');
const Delivery = require('../Models/deliveryModel');
const Notification = require('../Models/notificationModel');
const { updateMany } = require('../Models/userModel');

const paymentMethodsLookup={
  'Cash on Delivery':'cod',
  'Card':'card'
}

const getCart = async (userId) => {
  try {
    const carts = await Cart.find({ userId }).populate('medicineId');
    if (!carts || carts.length === 0) return {};
    // console.log("carts",carts);
    const cartItems = carts.map(cart => ({
      medicineId: cart.medicineId[0],
      quantity: cart.quantity,
      variant: cart.variant.mg,
      price: cart.medicineId[0].variants.find(variant => variant.mg === cart.variant.mg).price,
      stock: cart.medicineId[0].variants.find(variant => variant.mg === cart.variant.mg).stock,
    }));
    console.log("cartItems",cartItems);
    // carts[0].medicineId = {...cartItems};
    
    // console.log("carts[0]",carts[0]);
    return cartItems;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}
//will add order in delivery model
const addOrderToDelivery = async (orderId) => {
  try {
    const delivery = new Delivery({ orderId });
    await delivery.save();
  } catch (error) {
    console.error('Error adding order to delivery:', error);
  }
}

const addNotification = async (userId, orderId) => {
  try {
    const notification = new Notification({
      userId,
      orderId,
      message: `Your order with ID ${orderId} has been placed successfully.`,
    });
    await notification.save();
  } catch (error) {
    console.error('Error adding notification:', error);
  }
}

const clearCart = async (userId) => {
  try {
    await Cart.deleteMany({ userId });
  }
  catch (error) {
    console.error('Error clearing cart:', error);
  }
}


exports.placeOrder = async (req, res) => {
  try {

    let { medicines, deliveryAddress, paymentMethod, shouldEmptyCart=false } = req.body;
    medicines = medicines.filter(item => item?.id && item?.quantity > 0 && item?.dosage );
    let cart = {};

    if(shouldEmptyCart) medicines = await getCart(req.user.id);
    if (!medicines || medicines.length === 0 || !deliveryAddress || !paymentMethod) {
      console.log("Validation error");
      return res.status(400).json({ message: 'Medicines, delivery address, and payment status are required.' });
    }
    let totalAmount = 0;
    let modifiedMedicines = medicines.map(async item => {
      const medicine = shouldEmptyCart ? item : await Medicine.findById(item.id);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.id}` });
      }

      const variant = shouldEmptyCart
        ? {stock:item.stock, price:item.price}
        : medicine.variants.find((variant) => variant.mg === item.dosage);
      
      if (!variant) {
        return res.status(400).json({ message: `Variant with index not found for this medicine.` });
      }

      if ( (shouldEmptyCart && item.quantity > item.stock ) || (!shouldEmptyCart && variant.stock < item.quantity)) {
        return res.status(400).json({ message: `Insufficient stock for medicine `});
      }
      if(shouldEmptyCart){item.stock -= item.quantity;}
      else{variant.stock -= item.quantity;}

      await Medicine.updateOne(
        {
          _id: item.medicineId,
          'variants.mg': variant.mg
        },
        {
          $set: { 'variants.$.stock': variant.stock }
        }
      );
      
      totalAmount += (variant.price * item.quantity);

      return {
        medicineId: item.medicineId?._id || item.medicineId,
        mg: variant.mg || item.variant,
        quantity: item.quantity,
      }
    });
    modifiedMedicines= await Promise.all(modifiedMedicines);
    const order = new Order({
      userId: req.user.id,
      medicines: modifiedMedicines,
      totalAmount,
      deliveryAddress,
      paymentMethod:paymentMethodsLookup[paymentMethod],
    });
    await order.save();
    if(shouldEmptyCart) clearCart(req.user.id);
    await addOrderToDelivery(order._id);
    await addNotification(req.user.id, order._id);
    
    return res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ message: 'Error placing order', error });
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
  