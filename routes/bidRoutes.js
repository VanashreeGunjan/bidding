const express = require('express');
const bidController = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.get('/', bidController.getBids);
router.post('/', authMiddleware, bidController.placeBid);

module.exports = router;
