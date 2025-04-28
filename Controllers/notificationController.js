const notification= require('../Models/notificationModel'); // Adjust the path as necessary

exports.getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.user.id });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  };
  
  exports.markAsRead = async (req, res) => {
    try {
      const updated = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Notification not found' });
      res.json({ message: 'Notification marked as read', updated });
    } catch (error) {
      res.status(500).json({ message: 'Error marking as read', error });
    }
  };
  
  exports.createNotification = async (req, res) => {
    try {
      const { userId, title, message, type } = req.body;
      const notification = new Notification({ userId, title, message, type });
      await notification.save();
      res.status(201).json({ message: 'Notification created', notification });
    } catch (error) {
      res.status(500).json({ message: 'Error creating notification', error });
    }
  };
  
  exports.deleteNotification = async (req, res) => {
    try {
      const deleted = await Notification.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Notification not found' });
      res.json({ message: 'Notification deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting notification', error });
    }
  };
  