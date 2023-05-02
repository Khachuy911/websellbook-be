const cron = require('node-cron');
const moment = require('moment');

const { DEFAULT_VALUE, MESSAGE } = require('../helper/constant');
const FlashSale = require('../model/flashSaleModel');
const User = require('../model/userModel');
const { sendMail } = require('../helper/helper');

var task = cron.schedule(`*/1 * * * *`, async () => {

  console.log(`=====[CRON JOB] Start run cron job send mail before 15' flash sale`);

  const condition = {
    where: {
      startDate: moment().add(15, 'm'),
      isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
    },
    attributes: ['name']
  }

  const flashSale = await FlashSale.findAll(condition);

  if (flashSale.length > 0) {
    const condition2 = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
      attributes: ['email'],
    };

    let title = MESSAGE.TITLE_FLASHSALE;

    const user = await User.findAll(condition2);

    const html = `<button style="background-color: rgb(105, 192, 233); width: 100px; height: 50px; border: 1px solid red">
      <a style="text-decoration: none; color: white; font-size: 15pxs;" href="http://localhost:3000/product">Truy cập ngay</a></button>`;

    if (user.length > 0) {
      for (let i = 0; i < user.length; i++) {
        sendMail(user[i].email, title, html)
      }
    }
  }
}, {
  scheduled: false
});

module.exports = task;

