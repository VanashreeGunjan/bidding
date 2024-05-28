const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Item = require('./Item');

const Bid = sequelize.define('Bid', {
  bid_amount: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Bid.belongsTo(User, { foreignKey: 'user_id' });
Bid.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = Bid;
