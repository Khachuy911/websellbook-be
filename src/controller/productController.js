const { Op } = require("sequelize");

const sequelize = require("../config/connectDB");
const Product = require("../model/productModel");
const Comment = require("../model/commentModel");
const OrderDetail = require("../model/orderDetailModel");
const ProductImage = require("../model/productImageModel");
const ErrorResponse = require("../helper/errorResponse");
const { getPagination, getSort, search, filter } = require("../helper/helper");
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require("../helper/constant");
const Category = require("../model/categoryModel");
const FlashSaleProduct = require("../model/flashSaleProductModel");
const FlashSale = require("../model/flashSaleModel");
const User = require("../model/userModel");

module.exports = {
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const {
        name,
        barCode,
        priceImport,
        priceSelling,
        weight,
        quantity,
        description,
        categoryId,
      } = req.body;
      if (
        !name ||
        !barCode ||
        !priceImport ||
        !priceSelling ||
        !weight ||
        !quantity ||
        !description
      ) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK)
        );
      }

      const image = req.files;

      const data = {
        name,
        barCode,
        priceImport,
        priceSelling,
        weight,
        quantity,
        quantityDisplay: quantity,
        description,
        createdBy: req.user,
        updateBy: req.user,
        categoryId,
      };

      const product = new Product(data);

      await product.save({ transaction: t });

      const img = image.map((ele) => {
        let path = ele.path.split("\\");
        return {
          productId: product.id,
          name,
          url: path.join("/"),
          createdBy: req.user,
          updateBy: req.user,
        };
      });

      await ProductImage.bulkCreate(img, { transaction: t });

      await t.commit();
      res.status(HTTP_CODE.CREATED).json({
        isSuccess: true,
        message: MESSAGE.CREATED,
        data: null,
      });
    } catch (error) {
      await t.rollback();
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },

  getProduct: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        ...search(req.query.search),
        ...filter("categoryId", req.query.category),
      },
      include: [
        { model: Category },
        { model: ProductImage },
        { model: Comment },
        {
          model: FlashSaleProduct,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          required: false,
        },
      ],
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const product = await Product.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(product.count / +pageSize),
      totalSize: product.rows.length || 0,
      rows: product.rows,
      login: req.login
    };

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data,
    // });

    console.log("=====>Product:" + JSON.stringify(product));

    res.render("../view/home.ejs", { data: data});
  },

  getProductByCategory: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        ...search(req.query.search),
        // ...filter("categoryId", req.query.category),
      },
      include: [
        { model: ProductImage },
        {
          model: Category,
          where: {
            name: req.query?.category || null,
          },
        },
        {
          model: FlashSaleProduct,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          required: false,
        },
      ],

      // ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const product = await Product.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(product.count / +pageSize),
      totalSize: product.rows.length || 0,
      rows: product.rows,
    };

    if(req.query.response === 'api'){
      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data,
      });

    }

    // console.log("=====>Product:" + JSON.stringify(product));

    res.render("../view/productByCategory.ejs", { data: data });
  },

  searchProduct: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        ...search(req.query.search),
        ...filter("categoryId", req.query.category),
      },
      include: [
        { model: Category },
        { model: ProductImage },
        {
          model: FlashSaleProduct,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          required: false,
        },
      ],
      // ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const product = await Product.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(product.count / +pageSize),
      totalSize: product.rows.length || 0,
      rows: product.rows,
    };

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data,
    // });

    // console.log("=====>Product:" + JSON.stringify(product));

    res.render("../view/productByCategory.ejs", { data: data });
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: [
        { model: Category },
        { model: ProductImage },
        {
          model: Comment,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          required: false,
          include: {
            model: User,
            required: false,
            where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          },
        },
        {
          model: FlashSaleProduct,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          required: false,
          include: {
            model: FlashSale,
            required: false,
            where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          },
        },
      ],
    };
    const product = await Product.findOne(condition);

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data: product,
    // });


    

    const data = { product}
    console.log("==============> product detail: " + JSON.stringify(data));
    res.render("../view/productDetail.ejs", { data});
  },

  update: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (!id) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const {
        name,
        barCode,
        priceImport,
        priceSelling,
        weight,
        quantity,
        description,
        categoryId,
      } = req.body;

      const condition = {
        where: {
          id: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      const data = {
        name,
        barCode,
        priceImport,
        priceSelling,
        weight,
        quantity,
        description,
        createdBy: req.user,
        updateBy: req.user,
        categoryId,
      };

      await Product.update(data, condition);

      const image = req.files;

      if (image.length > 0) {
        const condition2 = {
          where: {
            productId: id,
          },
          transaction: t,
        };

        await ProductImage.destroy(condition2);

        const img = image.map((ele) => {
          let path = ele.path.split("\\");
          return {
            productId: id,
            name,
            url: path.join("/"),
            createdBy: req.user,
            updateBy: req.user,
          };
        });
        await ProductImage.bulkCreate(img, { transaction: t });
      }

      await t.commit();
      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data: null,
      });
    } catch (error) {
      await t.rollback();
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },

  deleteSoft: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { ids } = req.body;

      if (!ids) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const conditionOrder = {
        where: {
          productId: ids,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };
      const order = await OrderDetail.findAll(conditionOrder);

      if (order.length > 0) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const data = {
        isDeleted: DEFAULT_VALUE.IS_DELETED,
      };

      const condition = {
        where: {
          id: ids,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await Product.update(data, condition);

      const condition2 = {
        where: {
          productId: {
            [Op.in]: ids,
          },
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await ProductImage.update(data, condition2);

      await t.commit();

      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data: null,
      });
    } catch (error) {
      await t.rollback();
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },

  deleteHard: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { ids } = req.body;

      if (!ids) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const conditionOrder = {
        where: {
          productId: ids,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };
      const order = await OrderDetail.findAll(conditionOrder);

      if (order.length > 0) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const condition = {
        where: {
          id: ids,
        },
        transaction: t,
      };

      await Product.destroy(condition);

      await t.commit();
      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data: null,
      });
    } catch (error) {
      await t.rollback();
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },
};
