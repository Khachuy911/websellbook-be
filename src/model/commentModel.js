const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const Product = require('./productModel');
const User = require('./userModel');
const { DEFAULT_VALUE } = require('../helper/constant');

class Comment extends Model { }

Comment.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  text: {
    type: DataTypes.STRING
  },
  isDeleted: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_DELETED
  }
}, {
  sequelize,
  timestamps: true,
  modelName: 'Comment'
})

Product.hasMany(Comment, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  }
})

Comment.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false
  }
})

User.hasMany(Comment, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Comment.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

module.exports = Comment;