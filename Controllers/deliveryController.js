const deliveries= require('../Models/deliveryModel')
exports.getDeliveries = async (req, res) => {
    try {
      const deliveries = await deliveries.find().populate('orderId');
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching deliveries', error });
    }
  };
  
  exports.assignDelivery = async (req, res) => {
    try {
      const { orderId, assignedTo } = req.body;
      const delivery = new deliveries({ orderId, assignedTo });
      await delivery.save();
      res.status(201).json({ message: 'Delivery assigned', delivery });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning delivery', error });
    }
  };
  
  exports.updateDeliveryStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await deliveries.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Delivery not found' });
      res.json({ message: 'Delivery status updated', updated });
    } catch (error) {
      res.status(500).json({ message: 'Error updating delivery status', error });
    }
  };
  
//   exports.getUserDeliveries = async (req, res) => {
//     try {
//       const deliveries = await Delivery.find().populate({
//         path: 'orderId',
//         match: { userId: req.user.id }
//       });
//       const filtered = deliveries.filter(d => d.orderId !== null);
//       res.json(filtered);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching user deliveries', error });
//     }
//   };
  
exports.getDeliveryStatus = async (req, res) => {
    // console.log("getDeliveryStatus");
    try {
      // console.log(req.query);
      const orderId  = req.query.orderId;
      const delivery = await deliveries.findOne({ orderId }).populate('orderId');
      if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        res.json(delivery.status);
    }
    catch (error) {
      console.log(error.stack);
      res.status(500).json({ message: 'Error fetching delivery status', error });
    }
}