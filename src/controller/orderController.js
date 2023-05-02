const { Op } = require("sequelize");
const moment = require("moment");
const paypal = require("paypal-rest-sdk");
const sequelize = require("../config/connectDB");
const Order = require("../model/orderModel");
const OrderDetail = require("../model/orderDetailModel");
const Product = require("../model/productModel");
const FlashSale = require("../model/flashSaleModel");
const FlashSaleProduct = require("../model/flashSaleProductModel");
const Voucher = require("../model/voucherModel");
const ErrorResponse = require("../helper/errorResponse");
const puppeteer = require("puppeteer");
const {
  getPagination,
  getSort,
  randomNum,
  filter,
} = require("../helper/helper");
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require("../helper/constant");
const User = require("../model/userModel");

let totalGlobal;
module.exports = {
  create: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const test1 = Object.assign({}, req.body);
      console.log(test1);
      const data = req.body;
      console.log(data);
      let { product, voucherCode, address, phone } = test1;

      if (!product) {
        await t.rollback();
        return next(ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK));
      }

      product = JSON.parse(product);

      let count = {};

      for (var i = 0; i < product.length; i++) {
        var item = product[i];
        let id = item.id;
        if (count[id]) {
          count[id] += item.quantity;
        } else {
          count[id] = item.quantity;
        }
      }

      let bookInfo = [];

      for (let id in count) {
        bookInfo.push({ id: id, quantity: count[id] });
      }

      product = bookInfo;
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
        for (var j = 0; j < product.length; j++) {
          if (pro[i].id === product[j].id) {
            if (!pro || pro[i].quantityDisplay < product[j].quantity) {
              await t.rollback();
              return next(
                new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_OUT)
              );
            }
          }
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
          price:
            pro[i].priceSelling -
            (pro[i]?.FlashSaleProducts[0]?.discountAmount || 0),
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

      let orderData;

      if (req?.query?.orderNow === 1) {
        orderData = {
          totalPrice,
          orderCode: "OD-" + randomNum(),
          userId: req.user,
          voucherId: voucher ? voucher.id : null,
          createdBy: req.user,
          updateBy: req.user,
          orderStatus: DEFAULT_VALUE.VALUE_CONFIRM,
        };
      } else {
        orderData = {
          totalPrice,
          orderCode: "OD-" + randomNum(),
          userId: req.user,
          voucherId: voucher ? voucher.id : null,
          createdBy: req.user,
          updateBy: req.user,
          address: address,
          phone: phone,
        };
      }

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
        data: order,
      });
    } catch (error) {
      await t.rollback();
      console.log(error.message);
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  },

  // 1 xac nhan
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

  // 2 cho giao
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
          // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
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
        orderStatus: DEFAULT_VALUE.VALUE_CANCEL,
      };

      const order = await Order.findOne(condition);

      if (order.orderStatus > 1) {
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
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        // ...search(req.query.search),
        ...filter("orderStatus", req.query.status),
      },
      include: [
        {
          model: OrderDetail,
          required: false,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          include: {
            model: Product,
            required: false,
            where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          },
        },
        {
          model: User,
        },
      ],
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
    // console.log(data);
    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data,
    });
  },

  getMyOrder: async (req, res, next) => {
    const condition = {
      where: {
        userId: req.user,
        // orderStatus: 0,
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        // ...search(req.query.search)
      },
      include: [
        {
          model: Voucher,
        },
        {
          model: OrderDetail,
          include: {
            model: Product,
            include: {
              model: FlashSaleProduct,
            },
          },
        },
      ],
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
      currentUser: req.currentUser,
      login: req.login,
      user: req.prefixUser,
    };

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data,
    // });

    // console.log("========> Order: " + JSON.stringify(data));

    res.render("../view/orderStatus.ejs", { data });
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
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: [
        {
          model: Voucher,
        },
        {
          model: User,
        },
        {
          model: OrderDetail,
          include: {
            model: Product,
            include: {
              model: FlashSaleProduct,
            },
          },
        },
      ],
    };

    const order = await Order.findOne(condition);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: order,
      currentUser: req.currentUser,
    });
  },

  getDetailToExport: async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
    }

    const condition = {
      where: {
        id,
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: [
        {
          model: Voucher,
        },
        {
          model: User,
        },
        {
          model: OrderDetail,
          include: {
            model: Product,
            include: {
              model: FlashSaleProduct,
            },
          },
        },
      ],
    };

    const order = await Order.findOne(condition);

    const data = {
      order,
    };

    res.render("../view/orderDetail.ejs", {
      data,
    });
  },

  dashboard: async (req, res, next) => {
    const { numberMonth } = req.query;

    const condition = {
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "MonthDate"],
        [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
        [sequelize.fn("sum", sequelize.col("totalPrice")), "total_amount"],
      ],
      where: {
        $and: sequelize.where(
          sequelize.fn("MONTH", sequelize.col("createdAt")),
          numberMonth
        ),
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        orderStatus: 4,
      },
      ...getSort("createdAt", "1"),
      group: [sequelize.fn("DATE", sequelize.col("createdAt")), "Date"],
    };

    const order = await Order.findAll(condition);

    const conditionTotal = {
      attributes: [
        [
          sequelize.fn("sum", sequelize.col("totalPrice")),
          "total_amount_by_month",
        ],
      ],
      where: {
        $and: sequelize.where(
          sequelize.fn("MONTH", sequelize.col("createdAt")),
          numberMonth
        ),
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        orderStatus: 4,
      },
      ...getSort("createdAt", "1"),
    };

    const orderTotal = await Order.findAll(conditionTotal);

    const conditionQuantity = {
      attributes: ["id"],
      where: {
        $and: sequelize.where(
          sequelize.fn("MONTH", sequelize.col("order.createdAt")),
          numberMonth
        ),
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        orderStatus: 4,
      },
      include: {
        model: OrderDetail,
        attributes: [
          [sequelize.fn("sum", sequelize.col("quantity")), "total_quantity"],
        ],
      },
      ...getSort("createdAt", "1"),
    };

    const orderQuantity = await Order.findAll(conditionQuantity);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: order,
      currentUser: req.currentUser,
      orderTotal,
      orderQuantity,
    });
  },

  exportData: async (req, res) => {
    const idOrder = req.params.order;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`http://localhost:3000/order/export/${idOrder}`, {
      waitUntil: "networkidle2",
    });
    await page.setViewport({ width: 1680, height: 1050 });
    await page.pdf({
      path: `public/upload/${idOrder}.pdf`,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // res.redirect(`http://localhost:3000/upload/${idOrder}.pdf`);

    res.status(200).json({
      isSuccess: true,
      value: `http://localhost:3000/upload/${idOrder}.pdf`,
    });
  },

  paypalSuccess: async (req, res, next) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalGlobal,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          // res.render('cancle');
          console.log(error);
        } else {
          console.log(JSON.stringify(payment));
          const conditionOrder = {
            where: {
              paymentId: payment.id,
              isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
            },
          };
          const data = {
            payment: DEFAULT_VALUE.IS_ONLINE,
          };

          Order.update(data, conditionOrder);
          // res.json({ success: true });
          // res.render('success');
          res.redirect("/order/myorder");
        }
      }
    );
  },

  paypal: async (req, res, next) => {
    const id = req.query.order;

    if (!id) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
    }

    const condition = {
      where: {
        id,
        // isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      include: [
        {
          model: Voucher,
        },
        {
          model: User,
        },
        {
          model: OrderDetail,
          include: {
            model: Product,
            include: {
              model: FlashSaleProduct,
            },
          },
        },
      ],
    };

    const order = await Order.findOne(condition);

    let listItems = [];
    let totalPrice = 0;

    order.OrderDetails.forEach((ele) => {
      let total = (ele.price / 23000).toFixed(2);
      totalPrice = (
        parseFloat(totalPrice) +
        parseFloat(total) * parseInt(ele.quantity)
      ).toFixed(2);
      listItems.push({
        name: ele.Product.name,
        sku: ele.Product.barCode,
        price: total.toString(),
        currency: "USD",
        quantity: ele.quantity,
      });
    });
    totalGlobal = totalPrice;
    paypal.configure({
      mode: "sandbox", //sandbox or live
      client_id:
        "AXOe7Uh36I9ocdaRnCfaUPllor09ZzA2-3sXxsTaYvJY3IzISbEJDnRqqVwIvAVajJdJB0qrtH3e-itD",
      client_secret:
        "EOLpJJrRbXD6QwSl0_-Q82RvrzvzDWAzO72DqQ4vDSO7oquXQrtxeLdzdEMVefO1Ah9pl74d8E8J_lKJ",
    });
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/order/success",
        cancel_url: "http://localhost:3000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: listItems,
          },
          amount: {
            currency: "USD",
            total: totalPrice.toString(),
          },
          description: "Hat for the best team ever",
        },
      ],
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log(error);
      } else {
        console.log("====" + JSON.stringify(payment));
        const data = {
          paymentId: payment.id,
        };
        const conditionOrder = {
          where: {
            id: id,
            isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
          },
        };
        Order.update(data, conditionOrder);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.status(200).json({ url: payment.links[i].href, mesage: true });
          }
        }
      }
    });
  },
};
