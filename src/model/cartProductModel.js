const { DataTypes, Model } = require("sequelize");

const sequelize = require("../config/connectDB");
const Cart = require("./cartModel");
const Product = require("./productModel");
const { DEFAULT_VALUE } = require("../helper/constant");

class CartProduct extends Model {}

CartProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // defaultValue: DEFAULT_VALUE.DEDAULT_QUANTITY,
      validate: {
        min: 0,
      },
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      defaultValue: DEFAULT_VALUE.IS_NOT_DELETED,
    },
    createdBy: {
      type: DataTypes.STRING(36),
    },
    updateBy: {
      type: DataTypes.STRING(36),
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "CartProduct",
  }
);

Cart.hasMany(CartProduct, {
  foreignKey: {
    name: "cartId",
    allowNull: false,
  },
});

CartProduct.belongsTo(Cart, {
  foreignKey: {
    name: "cartId",
    allowNull: false,
  },
});

Product.hasMany(CartProduct, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
});

CartProduct.belongsTo(Product, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
});

module.exports = CartProduct;
