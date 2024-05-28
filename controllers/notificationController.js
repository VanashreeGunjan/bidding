const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({ where: { user_id: req.user.userId } });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notifications = await Notification.update({ is_read: true }, { where: { user_id: req.user.userId } });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
