const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const User = require('./userModel');
const Voucher = require('./voucherModel');
const { DEFAULT_VALUE } = require('../helper/constant');

class Order extends Model { }

Order.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  tax: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: DEFAULT_VALUE.DEFAULT_TAX,
    validate: {
      min: 0
    }
  },
  discount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: DEFAULT_VALUE.DEFAULT_DISCOUNT,
    validate: {
      min: 0
    }
  },
  orderCode: {
    type: DataTypes.STRING,
  },
  orderStatus: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.VALUE_CREATE
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
  modelName: 'Order'
})

User.hasMany(Order, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Order.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Voucher.hasOne(Order, {
  foreignKey: {
    name: 'voucherId'
  }
})

Order.belongsTo(Voucher, {
  foreignKey: {
    name: 'voucherId',
    allowNull: false
  }
})

module.exports = Order;