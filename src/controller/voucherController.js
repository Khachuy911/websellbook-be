const moment = require('moment');

const Voucher = require('../model/voucherModel');
const { randomNum } = require('../helper/helper');
const { getPagination, getSort, filter } = require('../helper/helper');
const ErrorResponse = require('../helper/errorResponse');
const { DEFAULT_VALUE, HTTP_CODE, MESSAGE } = require('../helper/constant');

module.exports = {
  create: async (req, res, next) => {
    const { name, quantity, discountAmount, expireDate } = req.body;

    if (!name || !discountAmount || !expireDate || !quantity)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK))

    const data = {
      name,
      voucherCode: `CODE-${randomNum()}`,
      quantity: quantity > 0 ? quantity : DEFAULT_VALUE.DEDAULT_QUANTITY,
      discountAmount: discountAmount > 0 ? discountAmount : DEFAULT_VALUE.DEFAULT_DISCOUNT,
      startDate: moment(),
      expireDate,
      createdBy: req.user,
      updateBy: req.user
    }

    const voucher = new Voucher(data);

    await voucher.save();

    res.status(HTTP_CODE.CREATED).json({
      isSuccess: true,
      message: MESSAGE.CREATED,
      data: null
    })
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, quantity, discountAmount, expireDate } = req.body;
    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }
    const voucher = await Voucher.findOne(condition);

    const data = {
      name,
      quantity: quantity > 0 ? quantity : DEFAULT_VALUE.DEDAULT_QUANTITY,
      discountAmount: discountAmount > 0 ? discountAmount : DEFAULT_VALUE.DEFAULT_DISCOUNT,
      expireDate
    }
    await Voucher.update(data, condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null
    })
  },

  getVoucher: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type)
    }

    const voucher = await Voucher.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(voucher.count / +pageSize),
      totalSize: voucher.rows.length || 0,
      rows: voucher.rows,
      login:req.login,
      user: req.prefixUser,

    }

    if(req.query.api == 1){
      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data
      })
    }

    // console.log("======" + JSON.stringify(data));

    res.render('../view/voucher.ejs', {data});
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    const condition = {
      where: {
        id: id,
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }

    const voucher = await Voucher.findOne(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: voucher
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

    await Voucher.update(data, condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null
    })
  },

  deleteHard: async (req, res, next) => {
    const { id } = req.params;

    if (!id)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const condition = {
      where: {
        id: id
      }
    }

    await Voucher.destroy(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null
    })
  },
}