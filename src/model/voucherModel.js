const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const User = require('./userModel');
const { DEFAULT_VALUE } = require('../helper/constant');

class Voucher extends Model { };

Voucher.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  voucherCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    // defaultValue: DEFAULT_VALUE.DEDAULT_QUANTITY,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.INTEGER,
    // defaultValue: DEFAULT_VALUE.DEFAULT_DISCOUNT,
    validate: {
      min: 0
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expireDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isDeleted: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_DELETED
  },
  createdBy: {
    type: DataTypes.STRING(36)
  },
  updateBy: {
    type: DataTypes.STRING(36)
  }
}, {
  sequelize,
  timestamps: true,
  modelName: 'Voucher'
})


module.exports = Voucher