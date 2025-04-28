const SupportRequest= require('../Models/supportModel');

 exports.submitRequest = async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      const support = new SupportRequest({
        userId: req.user?.id,
        name,
        email,
        subject,
        message
      });
      await support.save();
      res.status(201).json({ message: 'Support request submitted', support });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting support request', error });
    }
  };
  
//   exports.getAllRequests = async (req, res) => {
//     try {
//       const requests = await SupportRequest.find();
//       res.json(requests);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching support requests', error });
//     }
//   };
  
//   exports.updateRequestStatus = async (req, res) => {
//     try {
//       const { status } = req.body;
//       const updated = await SupportRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
//       if (!updated) return res.status(404).json({ message: 'Support request not found' });
//       res.json({ message: 'Support request status updated', updated });
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating support request', error });
//     }
//   };