const express = require('express');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);
router.post('/', authMiddleware, roleMiddleware(['user', 'admin']), itemController.upload, itemController.createItem);
router.put('/:id', authMiddleware, roleMiddleware(['user', 'admin']), itemController.upload, itemController.updateItem);
router.delete('/:id', authMiddleware, roleMiddleware(['user', 'admin']), itemController.deleteItem);

module.exports = router;
