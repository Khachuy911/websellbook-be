const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const Product = require('./productModel');
const User = require('./userModel');
const { DEFAULT_VALUE } = require('../helper/constant');

class Cart extends Model { }

Cart.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  isDeleted: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_DELETED
  }
}, {
  sequelize,
  timestamps: true,
  modelName: 'Cart'
})

User.hasOne(Cart, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Cart.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

module.exports = Cart;