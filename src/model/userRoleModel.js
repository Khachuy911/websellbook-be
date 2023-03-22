const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const { DEFAULT_VALUE } = require('../helper/constant');
const User = require('../model/userModel');
const Role = require('../model/roleModel');

class UserRole extends Model { };

UserRole.init({
  id:{
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
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
  modelName: 'UserRole',
  indexes:[{unique: true, fields: ['roleId', 'userId']}]
})

User.hasMany(UserRole, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

UserRole.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Role.hasMany(UserRole, {
  foreignKey: {
    name: 'roleId',
    allowNull: false
  }
})
UserRole.belongsTo(Role, {
  foreignKey: {
    name: 'roleId',
    allowNull: false,
    defaultValue: DEFAULT_VALUE.IS_CUSTOMER
  }
})

module.exports = UserRole;