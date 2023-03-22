const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const { DEFAULT_VALUE } = require('../helper/constant');

class FlashSale extends Model { }

FlashSale.init({
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
  description: {
    type: DataTypes.STRING
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
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
  timestamps: {

  },
  modelName: 'FlashSale'
})


module.exports = FlashSale;