const nodemailer = require('nodemailer');
const random = require('random-number');
const { Op } = require('sequelize');

const { DEFAULT_VALUE } = require('../helper/constant');

module.exports =
{
  getPagination: (page) => {
    const limit = JSON.parse(process.env.DEFAULT_LIMIT_PAGE);
    const offset = page ? (page) * limit : JSON.parse(process.env.DEFAULT_PAGE);
    return { offset, limit };
  },

  getSort: (title, type) => {
    title = title || DEFAULT_VALUE.DEFAULT_TITLE;
    type = (type == 1 ? 'ASC' : 'DESC') || DEFAULT_VALUE.DEFAULT_TYPE_ORDER;
    return { order: [[title, type]] }
  },

  sendMail: (email, text, link) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'WEB PROJECT',
      html: `<div>
              <h2>${text}</h2>
              ${link}
            </div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  },

  randomNum: () => {
    const options = {
      min: 10000,
      max: 99999,
      integer: true
    }
    return random(options)
  },

  search: (query) => {
    if (query) {
      const condition = {
        [Op.or]: [
          {
            name: {
              [Op.substring]: `${query}`
            }
          },
          {
            description: {
              [Op.substring]: `${query}`
            }
          }
        ]
      }
      return condition;
    }
  },

  filter: (name, value) => {
    if (name && value) {
      const condition = {
        [name]: {
          [Op.like]: `%${value}%`
        }
      }
      return condition;
    }
  }
}