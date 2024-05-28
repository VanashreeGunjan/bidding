const Bid = require('../models/Bid');
const Item = require('../models/Item');
const io = require('../server').io;

exports.placeBid = async (req, res) => {
  try {
    const { bid_amount } = req.body;
    const { itemId } = req.params;
    const userId = req.user.userId;

    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (bid_amount <= item.current_price) {
      return res.status(400).json({ error: 'Bid must be higher than current price' });
    }

    const bid = await Bid.create({ item_id: itemId, user_id: userId, bid_amount });
    await item.update({ current_price: bid_amount });

    io.emit('update', { itemId, bid_amount });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBids = async (req, res) => {
  try {
    const { itemId } = req.params;
    const bids = await Bid.findAll({ where: { item_id: itemId } });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
