const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const Order = require('./orderModel');
const Product = require('./productModel');
const { DEFAULT_VALUE } = require('../helper/constant');

class OrderDetail extends Model { }

OrderDetail.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: DEFAULT_VALUE.DEFAULT_PRICE
  },
  tax: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: DEFAULT_VALUE.DEFAULT_DISCOUNT
  },
  discount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: DEFAULT_VALUE.DEFAULT_DISCOUNT,
    validate: {
      min: 0
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // defaultValue: DEFAULT_VALUE.DEDAULT_QUANTITY,
    validate: {
      min: 0
    }
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
  modelName: 'OrderDetail'
})

Order.hasMany(OrderDetail, {
  foreignKey: {
    name: 'orderId',
    allowNull: false
  }
});

OrderDetail.belongsTo(Order, {
  foreignKey: {
    name: 'orderId',
    allowNull: false
  }
});

Product.hasMany(OrderDetail, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  }
});

OrderDetail.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  }
});


module.exports = OrderDetail;