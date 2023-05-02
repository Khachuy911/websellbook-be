const { DataTypes, Model } = require("sequelize");

const sequelize = require("../config/connectDB");
const { DEFAULT_VALUE } = require("../helper/constant");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 150,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Email đã tồn tại !" },
      validate: {
        isEmail: { msg: "This is not an email format" },
      },
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: DEFAULT_VALUE.IS_NOT_VERIFY,
    },
    phone: {
      type: DataTypes.STRING(11),
      validate: {
        isNumeric: { msg: "Number phone will only allow numbers" },
      },
    },
    address: {
      type: DataTypes.STRING(250),
    },
    verifyCode: {
      type: DataTypes.STRING,
    },
    verifyCodeValid: {
      type: DataTypes.DATE,
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      defaultValue: DEFAULT_VALUE.IS_NOT_DELETED,
    },
    createdBy: DataTypes.STRING(36),
    updateBy: DataTypes.STRING(36),
  },
  {
    sequelize,
    timestamps: true,
    modelName: "User",
  }
);

module.exports = User;
