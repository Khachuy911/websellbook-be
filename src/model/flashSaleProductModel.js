const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const FlashSale = require('./flashSaleModel');
const Product = require('./productModel');
const { DEFAULT_VALUE } = require('../helper/constant')

class FlashSaleProduct extends Model { };

FlashSaleProduct.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  discountAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  modelName: 'FlashSaleProduct',
  indexes: [{ unique: true, fields: ['productId', 'flashSaleId'] }]
})

FlashSale.hasMany(FlashSaleProduct, {
  foreignKey: {
    name: 'flashSaleId',
    allowNull: false
  }
});

FlashSaleProduct.belongsTo(FlashSale, {
  foreignKey: {
    name: 'flashSaleId',
    allowNull: false
  }
});

Product.hasMany(FlashSaleProduct, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  }
});

FlashSaleProduct.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  }
});


module.exports = FlashSaleProduct;