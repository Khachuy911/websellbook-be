const Role = require('../model/roleModel');
const User = require('../model/userModel');
const sequelize = require('../config/connectDB');
const UserRole = require('../model/userRoleModel');
const { getPagination, getSort, search, filter } = require('../helper/helper');
const ErrorResponse = require('../helper/errorResponse');
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require('../helper/constant');

module.exports = {

  getUser: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        ...search(req.query.search),
        ...filter('status', req.query.status)
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
      include: {
        model: UserRole,
        required: false,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        include: {
          model: Role,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
          attributes: ['name']
        }
      },
    }

    const user = await User.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(user.count / +pageSize),
      totalSize: user.rows.length || 0,
      rows: user.rows
    }

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data
    })
  },

  getMe: async (req, res, next) => {
    const id = req.user;

    if (!id)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: {
        model: UserRole,
        right: true,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        include: {
          model: Role,
          right: true,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
          attributes: ['name']
        }
      }
    }

    const user = await User.findOne(condition);

    if (!user)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: user
    })
  },

  updateUser: async (req, res, next) => {
    const id = req.user;

    if (!id)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const { username, age, phone, address } = req.body;

    const data = {
      age,
      phone,
      address,
      username
    }

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }

    await User.update(data, condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null
    })
  },

  deleteSoft: async (req, res, next) => {
    const { id } = req.params;

    if (!id)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const data = {
      isDeleted: DEFAULT_VALUE.IS_DELETED
    }

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }

    await User.update(data, condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null
    })
  },

  deleteHard: async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    if (!id)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }

    await User.destroy(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null
    })
  },
}