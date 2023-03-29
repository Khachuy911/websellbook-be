const { Op } = require("sequelize");
const moment = require("moment");

const sequelize = require("../config/connectDB");
const Order = require("../model/orderModel");
const OrderDetail = require("../model/orderDetailModel");
const Product = require("../model/productModel");
const FlashSale = require("../model/flashSaleModel");
const FlashSaleProduct = require("../model/flashSaleProductModel");
const Voucher = require("../model/voucherModel");
const ErrorResponse = require("../helper/errorResponse");
const {
  getPagination,
  getSort,
  randomNum,
  filter,
} = require("../helper/helper");
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require("../helper/constant");

module.exports = {
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { product, voucherCode } = req.body;

      if (!product) {
        await t.rollback();
        return next(ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK));
      }

      product.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return -1;
        }
        return 0;
      });

      const productIds = product.map((ele) => {
        return (ele = ele.id);
      });

      const condition = {
        where: {
          id: productIds,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        attributes: ["id", "priceSelling", "quantity", "quantityDisplay"],

        include: {
          model: FlashSaleProduct,
          required: false,
          where: {
            isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
          },
          attributes: ["discountAmount", "isDeleted"],

          include: {
            model: FlashSale,
            required: false,
            where: {
              startDate: {
                [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              endDate: {
                [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
            },
            isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
            attributes: ["startDate", "endDate", "isDeleted"],
          },
        },
      };

      let pro = await Product.findAll(condition);

      if (!pro) {
        await t.rollback();
        return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_OUT));
      }

      let priceArr = [];
      let sum = 0;

      for (var i = 0; i < pro.length; i++) {
        if (!pro || pro[i].quantityDisplay < product[i].quantity) {
          await t.rollback();
          return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_OUT));
        }

        if (pro[i].FlashSaleProducts.length > 0) {
          sum +=
            (pro[i].priceSelling - pro[i].FlashSaleProducts[0].discountAmount) *
            product[i].quantity;
        } else {
          sum += pro[i].priceSelling * product[i].quantity;
        }

        let objPro = {
          quantityDisplay: pro[i].quantityDisplay - product[i].quantity,
        };

        const conditionPro = {
          where: {
            id: product[i].id,
          },
          transaction: t,
        };

        await Product.update(objPro, conditionPro);

        let obj = {
          price: pro[i].priceSelling,
          productId: product[i].id,
          quantity: product[i].quantity,
        };
        priceArr.push(obj);
      }

      let totalPrice, voucher;

      if (voucherCode) {
        const conditionVoucher = {
          where: {
            voucherCode,
            isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
            startDate: {
              [Op.lte]: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            expireDate: {
              [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          },
        };

        voucher = await Voucher.findOne(conditionVoucher);

        if (!voucher || voucher.quantity <= 0) {
          await t.rollback();
          return next(
            new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.VOUCHER_INVALID)
          );
        }

        totalPrice =
          sum + sum * DEFAULT_VALUE.DEFAULT_TAX - voucher.discountAmount;

        const data = {
          quantity: voucher.quantity - 1,
        };

        await Voucher.update(data, conditionVoucher);
      } else {
        totalPrice = sum + sum * DEFAULT_VALUE.DEFAULT_TAX;
      }

      const orderData = {
        totalPrice,
        orderCode: "OD-" + randomNum(),
        userId: req.user,
        voucherId: voucher ? voucher.id : null,
        createdBy: req.user,
        updateBy: req.user,
      };

      const order = new Order(orderData);

      await order.save({ transaction: t });

      const orderDetailData = priceArr.map((ele) => {
        return {
          ...ele,
          orderId: order.id,
          createdBy: req.user,
          updateBy: req.user,
        };
      });

      await OrderDetail.bulkCreate(orderDetailData, { transaction: t });

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

  // 1 dat hang
  confirmStauts: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const conditionOrder = {
        where: { id: id },
        include: {
          model: OrderDetail,
          attributes: ["quantity"],
          include: {
            model: Product,
            attributes: ["id", "quantity", "quantityDisplay"],
          },
        },
        transaction: t,
      };

      const order = await Order.findOne(conditionOrder);

      if (!order)
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );

      if (order.orderStatus === DEFAULT_VALUE.VALUE_CREATE) {
        const data = {
          orderStatus: DEFAULT_VALUE.VALUE_CONFIRM,
        };

        await Order.update(data, conditionOrder);

        const arrPrice = order.OrderDetails;
        for (let i = 0; i < arrPrice.length; i++) {
          let dataProduct = {
            quantity: arrPrice[i].Product.quantity - arrPrice[i].quantity,
          };

          let conditionProduct = {
            where: { id: arrPrice[i].Product.id },
            transaction: t,
          };

          if (arrPrice[i].Product.quantity < arrPrice[i].quantity)
            return next(
              new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_OUT)
            );

          await Product.update(dataProduct, conditionProduct);
        }

        await t.commit();
        res.status(HTTP_CODE.SUCCESS).json({
          isSuccess: true,
          message: MESSAGE.SUCCESS,
          data: null,
        });
      } else {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_CONFIRM)
        );
      }
    } catch (error) {
      await t.rollback();
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },

  // 2 xac nhan
  shippingStauts: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const conditionOrder = {
        where: { id: id },
        transaction: t,
      };

      const order = await Order.findOne(conditionOrder);

      if (!order)
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );

      if (order.orderStatus === DEFAULT_VALUE.VALUE_CONFIRM) {
        const data = {
          orderStatus: DEFAULT_VALUE.VALUE_SHIPPING,
        };

        await Order.update(data, conditionOrder);
      } else {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_CONFIRM)
        );
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

  // 3 dang giao
  delivereStauts: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const conditionOrder = {
        where: { id: id },
        transaction: t,
      };

      const order = await Order.findOne(conditionOrder);

      if (!order)
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );

      if (order.orderStatus === DEFAULT_VALUE.VALUE_SHIPPING) {
        const data = {
          orderStatus: DEFAULT_VALUE.VALUE_DELIVERE,
        };

        await Order.update(data, conditionOrder);
      } else {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_CONFIRM)
        );
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

  // 4 done
  doneStauts: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const conditionOrder = {
        where: { id: id },
        transaction: t,
      };

      const order = await Order.findOne(conditionOrder);

      if (!order)
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );

      if (order.orderStatus === DEFAULT_VALUE.VALUE_DELIVERE) {
        const data = {
          orderStatus: DEFAULT_VALUE.VALUE_DONE,
        };

        await Order.update(data, conditionOrder);
      } else {
        await t.rollback();
        return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_DONE));
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

  // 5 huy
  cancelOrder: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const condition = {
        where: {
          id: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        include: {
          model: OrderDetail,
          attributes: ["quantity"],
          include: {
            model: Product,
            attributes: ["id", "quantity", "quantityDisplay"],
          },
        },
      };

      const data = {
        isDeleted: DEFAULT_VALUE.IS_DELETED,
      };

      const order = await Order.findOne(condition);

      if (order.orderStatus >= 3) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_CANCEL)
        );
      }

      if (!order) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.ORDER_IS_CANCEL)
        );
      }

      // CANCEL ORDER AND ORDERDETAIL
      const conditionOrder = {
        where: {
          id: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await Order.update(data, conditionOrder);

      const conditionOrderDetail = {
        where: {
          orderId: id,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        transaction: t,
      };

      await OrderDetail.update(data, conditionOrderDetail);

      // UPDATE QUANTITY OF VOUCHER IF ORDER HAS VOUCHER
      if (order.voucherId) {
        const conditionVoucher = {
          where: {
            id: order.voucherId,
            isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
          },
        };

        const voucher = await Voucher.findOne(conditionVoucher);

        if (voucher) {
          const dataVoucher = {
            quantity: voucher.quantity + 1,
          };

          await Voucher.update(dataVoucher, conditionVoucher);
        }
      }

      //UPDATE QUANTITY OF PRODUCT
      for (let i = 0; i < order.OrderDetails.length; i++) {
        let dataProduct = {};
        // IF ORDER IS COMFIRMED, WILL UPDATE QUANTITY AND QUANTITYDISPLAY
        if (order.orderStatus > 0) {
          dataProduct = {
            quantityDisplay:
              order.OrderDetails[i].Product.quantityDisplay +
              order.OrderDetails[i].quantity,
            quantity:
              order.OrderDetails[i].Product.quantity +
              order.OrderDetails[i].quantity,
          };
        } else {
          dataProduct = {
            quantityDisplay:
              order.OrderDetails[i].Product.quantityDisplay +
              order.OrderDetails[i].quantity,
          };
        }

        let conditionProduct = {
          where: {
            id: order.OrderDetails[i].Product.id,
          },
          transaction: t,
        };

        await Product.update(dataProduct, conditionProduct);
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

  getOrder: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        // ...search(req.query.search)
        ...filter("orderStatus", req.query.status),
      },
      include: {
        model: OrderDetail,
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const order = await Order.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(order.count / +pageSize),
      totalSize: order.rows.length || 0,
      rows: order.rows,
    };

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data,
    });
  },

  getMyOrder: async (req, res, next) => {
    const condition = {
      where: {
        userId: req.user.id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        // ...search(req.query.search)
      },
      include: {
        model: OrderDetail,
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const order = await Order.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(order.count / +pageSize),
      totalSize: order.rows.length || 0,
      rows: order.rows,
      currentUser: req.user,
    };

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data,
    // });

    console.log("========> Order: " + JSON.stringify(data));

    res.render("../view/order.ejs", { data });
  },

  getDetail: async (req, res, next) => {
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
      include: {
        model: OrderDetail,
        include: {
          model: Product,
        },
      },
    };

    const order = await Order.findOne(condition);

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data: order,
    // });

    console.log("========> Order: " + JSON.stringify(order));

    res.render("../view/orderDetail.ejs", { data: order });
  },
};
