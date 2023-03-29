const { DataTypes, Model } = require("sequelize");

const sequelize = require("../config/connectDB");
const { DEFAULT_VALUE } = require("../helper/constant");

class Author extends Model {}

Author.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
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
    modelName: "Author",
  }
);

module.exports = Author;
