const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const Category = require('./categoryModel');
const { DEFAULT_VALUE } = require('../helper/constant');

class Product extends Model { }

Product.init({
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
  barCode: {
    type: DataTypes.STRING
  },
  priceImport: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  priceSelling: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  // priceSellingAfterFlashSale: {
  //   type: DataTypes.DOUBLE,
  //   allowNull: false,
  //   validate: {
  //     min: 0
  //   },
  //   defaultValue: 0
  // },
  weight: {
    type: DataTypes.DOUBLE,
    validate: {
      min: 0
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  quantityDisplay: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1
    }
  },
  description: {
    type: DataTypes.STRING
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
  modelName: 'Product'
})

Category.hasMany(Product, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false
  }
})

Product.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false
  }
})

module.exports = Product;