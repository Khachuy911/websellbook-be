const { DataTypes, Model } = require('sequelize');

const sequelize = require('../config/connectDB');
const { DEFAULT_VALUE } = require('../helper/constant');
const Role = require('./roleModel');

class RoleModule extends Model { };

RoleModule.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  api: {
    type: DataTypes.STRING
  },
  isCanRead: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_ACTIVE
  },
  isCanEdit: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_ACTIVE
  },
  isCanAdd: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_ACTIVE
  },
  isCanDelete: {
    type: DataTypes.INTEGER,
    defaultValue: DEFAULT_VALUE.IS_NOT_ACTIVE
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
  modelName: 'RoleModule'
})

Role.hasMany(RoleModule, {
  foreignKey: {
    name: 'roleId',
    allowNull: false
  }
})

RoleModule.belongsTo(Role, {
  foreignKey: {
    name: 'roleId',
    allowNull: false
  }
})



module.exports = RoleModule;