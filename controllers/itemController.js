const Item = require('../models/Item');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

exports.upload = upload.single('image');

exports.createItem = async (req, res) => {
  try {
    const { name, description, starting_price, end_time } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    const item = await Item.create({ name, description, starting_price, end_time, image_url });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    const { name, description, starting_price, end_time } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : item.image_url;
    await item.update({ name, description, starting_price, end_time, image_url });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    await item.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
