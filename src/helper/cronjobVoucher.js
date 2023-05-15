const cron = require("node-cron");
const moment = require("moment");
const { Op } = require("sequelize");

const { DEFAULT_VALUE } = require("../helper/constant");
const FlashSale = require("../model/flashSaleModel");
const FlashSaleProduct = require("../model/flashSaleProductModel");
const Voucher = require("../model/voucherModel");

var task = cron.schedule(
  `*/1 * * * *`,
  async () => {
    console.log(
      `=====[CRON JOB] Start run cron job DELETE FLASHSALE AND VOUCHER`
    );

    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        endDate: {
          [Op.lt]: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      },
      attributes: ["id"],
    };
    const flashSale = await FlashSale.findAll(condition);

    const data = {
      isDeleted: DEFAULT_VALUE.IS_DELETED,
    };

    const dataFlashsale = {
      isDeleted: DEFAULT_VALUE.IS_DELETED,
      isActive: 2,
    };

    if (flashSale.length > 0) {
      const arrIdFlashSale = flashSale.map((ele) => {
        return (ele = ele.id);
      });

      const condition2 = {
        where: {
          id: arrIdFlashSale,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };

      await FlashSale.update(dataFlashsale, condition2);

      const condition3 = {
        where: {
          flashSaleId: arrIdFlashSale,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };

      await FlashSaleProduct.update(dataFlashsale, condition3);
    }

    // PROCESS VOUCHER
    const conditionVoucher = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        [Op.or]: {
          expireDate: {
            [Op.lt]: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      },
      attributes: ["id"],
    };
    const voucher = await Voucher.findAll(conditionVoucher);

    if (voucher.length > 0) {
      const arrIdVoucher = voucher.map((ele) => {
        return (ele = ele.id);
      });

      const conditionVoucher1 = {
        where: {
          id: arrIdVoucher,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
      };

      await Voucher.update(data, conditionVoucher1);
    }
  },
  {
    scheduled: false,
  }
);

module.exports = task;
