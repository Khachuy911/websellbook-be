const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const Auth = require('../model/authorModel');
const ErrorResponse = require('../helper/errorResponse');
const { getPagination, getSort, search } = require('../helper/helper');
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require('../helper/constant');

module.exports = {
  create: async (req, res, next) => {
    const { name } = req.body;
    if (!name)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK))

    const image = req.file
    let path = image.path.split('\\');

    const data = {
      name,
      image: path.join('/'),
      createdBy: req.user,
      updateBy: req.user
    }

    const category = new Category(data);

    await category.save();

    res.status(HTTP_CODE.CREATED).json({
      isSuccess: true,
      message: MESSAGE.CREATED,
      data: null,
    })
  },

  getCategory: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        // ...search(req.query.search)
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type)
    }

    const category = await Category.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(category.count / +pageSize),
      totalSize: category.rows.length || 0,
      rows: category.rows
    }

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data
    })
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    const condition = {
      where: {
        id: id,
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }
    const category = await Category.findOne(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: category,
    })
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const image = req.file;
    const { name } = req.body;

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }

    let data = {
      name,
      createdBy: req.user,
      updateBy: req.user
    };

    if (image) {
      const path = image.path.split('\\');
      data = {
        image: path.join('/'),
        ...data
      }
    }

    await Category.update(data, condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null,
    })
  },

  deleteSoft: async (req, res, next) => {
    const { ids } = req.body;
    if (!ids)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));

    const conditionProduct = {
      where: {
        categoryId: ids,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED
      }
    }
    const product = await Product.findAll(conditionProduct);

    if (product.length > 0)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const data = {
      isDeleted: DEFAULT_VALUE.IS_DELETED
    }

    const condition = {
      where: {
        id: ids,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      }
    }

    await Category.update(data, condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null,
    })
  },

  deleteHard: async (req, res, next) => {
    const { ids } = req.body;

    if (!ids) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }

    const conditionProduct = {
      where: {
        categoryId: ids,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED
      }
    }
    const product = await Product.findAll(conditionProduct);

    if (product.length > 0)
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST))

    const condition = {
      where: {
        id: ids,
      }
    }

    await Category.destroy(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null,
    })
  },
}