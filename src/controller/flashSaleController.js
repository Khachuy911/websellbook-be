const cron = require("node-cron");

const sequelize = require("../config/connectDB");
const FlashSale = require("../model/flashSaleModel");
const FlashSaleProduct = require("../model/flashSaleProductModel");
const ErrorResponse = require("../helper/errorResponse");
const { getPagination, getSort, search } = require("../helper/helper");
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require("../helper/constant");
const { Op } = require("sequelize");

const Product = require("../model/productModel");

module.exports = {
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      let { name, startDate, endDate, description, discountAmount, productId } =
        req.body;
      if (typeof req.body.productId == "string") {
        productId = [productId];
      }
      if (
        !name ||
        !description ||
        !startDate ||
        !endDate ||
        !discountAmount ||
        !productId
      ) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK)
        );
      }

      const data = {
        name,
        description,
        startDate,
        endDate,
        createdBy: req.user,
        updateBy: req.user,
      };

      const flashSale = new FlashSale(data);

      await flashSale.save({ transaction: t });

      if (!flashSale) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const proId = productId.map((ele) => {
        return {
          productId: ele,
          discountAmount,
          flashSaleId: flashSale.id,
          createdBy: req.user,
          updateBy: req.user,
        };
      });

      await FlashSaleProduct.bulkCreate(proId, { transaction: t });

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

  getFlashSale: async (req, res, next) => {
    const condition = {
      where: {
        ...search(req.query.search),
      },
      include: {
        model: FlashSaleProduct,
        include: {
          model: Product,
        },
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const flashSale = await FlashSale.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(flashSale.count / +pageSize),
      totalSize: flashSale.rows.length || 0,
      rows: flashSale.rows,
    };

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data,
    });
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    if (!id)
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: {
        model: FlashSaleProduct,
      },
    };
    const flashSale = await FlashSale.findOne(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: flashSale,
    });
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
        startDate,
        endDate,
        description,
        discountAmount,
        productId,
      } = req.body;

      if (+discountAmount < 0) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const data = {
        name,
        description,
        startDate,
        endDate,
        createdBy: req.user,
        updateBy: req.user,
      };

      const condition = {
        where: {
          id: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await FlashSale.update(data, condition);

      if (productId) {
        const condition2 = {
          where: {
            flashSaleId: id,
            isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
          },
          transaction: t,
        };

        await FlashSaleProduct.destroy(condition2);

        const proId = productId.map((ele) => {
          return {
            productId: ele,
            discountAmount,
            flashSaleId: id,
            createdBy: req.user,
            updateBy: req.user,
          };
        });

        await FlashSaleProduct.bulkCreate(proId, { transaction: t });
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
      const { id } = req.params;

      if (!id) {
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
          id: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await FlashSale.update(data, condition);

      const condition2 = {
        where: {
          flashSaleId: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await FlashSaleProduct.update(data, condition2);

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
      const { id } = req.params;

      if (!id) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const condition = {
        where: {
          id: id,
        },
        transaction: t,
      };

      await FlashSale.destroy(condition);

      const condition2 = {
        where: {
          flashSaleId: id,
        },
        transaction: t,
      };

      await FlashSaleProduct.destroy(condition2);

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
