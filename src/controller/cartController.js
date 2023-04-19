const Cart = require("../model/cartModel");
const CartProduct = require("../model/cartProductModel");
const { getPagination, getSort, filter, search } = require("../helper/helper");
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require("../helper/constant");
const ErrorResponse = require("../helper/errorResponse");
const sequelize = require("../config/connectDB");
const Product = require("../model/productModel");
const FlashSaleProduct = require("../model/flashSaleProductModel");

module.exports = {
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK)
        );
      }

      const userId = req.user;

      const condition = {
        where: {
          userId,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };
      const cart = await Cart.findOne(condition);

      if (!cart?.dataValues) {
        const dataCart = {
          userId,
        };

        const cart = new Cart(dataCart);
        await cart.save();

        const dataCartProduct = {
          cartId: cart.id,
          productId,
          quantity,
        };

        const cartProduct = new CartProduct(dataCartProduct);
        await cartProduct.save();
      } else {
        const dataCartProduct = {
          cartId: cart.id,
          productId,
          quantity,
        };

        const cartProduct = new CartProduct(dataCartProduct);
        await cartProduct.save();
      }

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

  getCart: async (req, res, next) => {

    const userId = req.user;
      const conditionCart = {
        where: {
          userId,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };
      let cartDetail = await Cart.findOne(conditionCart);

      if (!cartDetail?.dataValues) {
        const dataCart = {
          userId,
        };

        const cart = new Cart(dataCart);
        await cart.save();

        cartDetail = cart;
    }

    const condition = {
      where: {
        cartId: cartDetail.id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: [
        {
          model: Product,
          // attributes: ["id","name", "author", "priceSelling"],
          include: {
            model: FlashSaleProduct,
            where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
            required: false,
            attributes: ["discountAmount"],
          },
        },
        {
          model: Cart,
          // attributes: ["id", "quantity"],
          order: [['createdAt', 'ASC']],
        }
      ],

      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const cart = await CartProduct.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(cart.count / +pageSize),
      totalSize: cart.rows.length || 0,
      rows: cart.rows,
      currentUser: req.currentUser,
    };

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data,
    // });

    // console.log("========> Order: " + JSON.stringify(data));

    res.render("../view/order.ejs", { data });
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const comment = await Cart.findOne(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: comment,
    });
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const condition = {
        where: {
          id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };

      const { text } = req.body;

      const data = {
        text,
      };

      await Comment.update(data, condition);

      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data: null,
      });
    } catch (error) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },

  deleteSoft: async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
      }

      const condition = {
        where: {
          id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };

      const data = {
        isDeleted: DEFAULT_VALUE.IS_DELETED,
      };

      await Comment.update(data, condition);

      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data: null,
      });
    } catch (error) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },
};
