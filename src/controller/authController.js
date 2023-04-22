const moment = require("moment");
// const Bcrypt = require('bcryptjs');
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const generator = require("generate-password");

const User = require("../model/userModel");
const { sendMail } = require("../helper/helper");
const sequelize = require("../config/connectDB");
const UserRole = require("../model/userRoleModel");
const RoleModule = require("../model/roleModuleModel");
const ErrorResponse = require("../helper/errorResponse");
const { DEFAULT_VALUE, HTTP_CODE, MESSAGE } = require("../helper/constant");

module.exports = {
  register: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      console.log(req.body);
      const { username, password, email, phone, age, address } = req.body;

      if (!username || !password || !email || !phone) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK)
        );
      }

      let token = generator.generate({
        length: DEFAULT_VALUE.LENGTH_TOKEN_VERIFY,
        uppercase: true,
      });

      const data = {
        username,
        // password: Bcrypt.hashSync(password, DEFAULT_VALUE.SALT_BCRYPT),
        password: md5(password),
        email,
        phone,
        age,
        address,
        verifyCode: token,
        verifyCodeValid: moment().add(
          DEFAULT_VALUE.MINUTE_VERIFY,
          DEFAULT_VALUE.TYPE_DATE_VERIFY
        ),
      };

      const user = new User(data);

      await user.save({ transaction: t });

      if (!user) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.REGISTER_FAIL)
        );
      }

      const data2 = {
        userId: user.id,
      };
      const userRole = new UserRole(data2);

      await userRole.save({ transaction: t });

      if (!userRole) {
        await t.rollback();
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.REGISTER_FAIL)
        );
      }

      const text = `Click vào đây để xác thực tài khoản của bạn, bạn có thể xác thực trong vòng 5 phút.`;
      const link = `${req.protocol}://${req.get(
        "host"
      )}/auth/views/check-verify?token=${token}&id=${user.id}`;
      const html = `<button style="background-color: rgb(105, 192, 233); width: 100px; height: 50px; border: 1px solid red">
      <a style="text-decoration: none; color: white; font-size: 15pxs;" href="${link}">Xác Thực Ngay</a></button>`;
      sendMail(user.email, text, html);

      await t.commit();

      res.status(HTTP_CODE.CREATED).json({
        isSuccess: true,
        message: MESSAGE.CREATED,
        data: link,
      });
    } catch (error) {
      await t.rollback();
      return next(new ErrorResponse(HTTP_CODE.SERVER_ERROR, error.message));
    }
  },
  reSendMail: async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK));
    }

    const condition = {
      where: {
        email,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        status: DEFAULT_VALUE.IS_NOT_ACTIVE,
      },
    };

    const user = await User.findOne(condition);

    if (!user) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
    }

    let token = generator.generate({
      length: DEFAULT_VALUE.LENGTH_TOKEN_VERIFY,
      uppercase: true,
    });

    user.verifyCode = token;
    user.verifyCodeValid = moment().add(
      DEFAULT_VALUE.MINUTE_VERIFY,
      DEFAULT_VALUE.TYPE_DATE_VERIFY
    );

    await user.save();

    const text = `Click vào đây để xác thực tài khoản của bạn, bạn có thể xác thực trong vòng 5 phút.`;
    const link = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify?token=${token}&id=${user.id}`;
    const html = `<button style="background-color: rgb(105, 192, 233); width: 100px; height: 50px; border: 1px solid red">
      <a style="text-decoration: none; color: white; font-size: 15pxs;" href="${link}">Xác Thực Ngay</a></button>`;

    sendMail(user.email, text, html);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.CHECK_MAIL,
      data: null,
    });
  },
  verify: (req, res, next) => {
    let token = req.query.token;
    let idUser = jwt.verify(token, process.env.JWT_SECRET_KEY).id;
    const condition = {
      where: {
        id: idUser,
        status: 0,
      },
    };
    User.findOne(condition)
      .then((data) => {
        if (data) {
          let { password, email, ...user } = data?.dataValues;
          res.status(200).render("../view/authPage/verify", {
            email: email,
          });
        } else {
          res.status(400).render("../view/authPage/forbidden");
        }
      })
      .catch((error) => res.status(500).json({ message: "Lỗi server" }));
  },
  verifyEmail: async (req, res, next) => {
    const { token, id } = req.query;

    const condition = {
      where: {
        id,
      },
    };
    const user = await User.findOne(condition);

    if (
      !user ||
      user.verifyCode !== token ||
      moment().isBefore(user.verifyCodeValid) == false
    ) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.VERIFY_FAIL)
      );
    }

    const data = {
      status: DEFAULT_VALUE.IS_VERIFY,
      verifyCode: null,
      verifyCodeValid: null,
    };
    await User.update(data, condition);

    // res.status(HTTP_CODE.SUCCESS).json({
    //   isSuccess: true,
    //   message: MESSAGE.SUCCESS,
    //   data: null,
    // });
    res.render("../view/authPage/verifySuccess.ejs");
  },
  logout: (req, res, next) => {
    res.clearCookie("token");
    res.redirect("/auth/views/login");
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK));
    }

    const condition = {
      where: {
        email: email,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const user = await User.findOne(condition);

    // if (!user || await !Bcrypt.compareSync(password, user.password))
    if (!user || md5(password) !== user.password) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_WRONG)
      );
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN,
    });
    if (user.status === 0) {
      let token1 = generator.generate({
        length: DEFAULT_VALUE.LENGTH_TOKEN_VERIFY,
        uppercase: true,
      });

      user.verifyCode = token1;
      user.verifyCodeValid = moment().add(
        DEFAULT_VALUE.MINUTE_VERIFY,
        DEFAULT_VALUE.TYPE_DATE_VERIFY
      );

      await user.save();

      const text = `Click vào đây để xác thực tài khoản của bạn, bạn có thể xác thực trong vòng 5 phút.`;
      const link = `${req.protocol}://${req.get(
        "host"
      )}/auth/views/check-verify?token=${token1}&id=${user.id}`;
      const html = `<button style="background-color: rgb(105, 192, 233); width: 100px; height: 50px; border: 1px solid red">
    <a style="text-decoration: none; color: white; font-size: 15pxs;" href="${link}">Xác Thực</a></button>`;
      sendMail(user.email, text, html);
      return res.status(403).json({
        isSuccess: true,
        message: MESSAGE.IS_NOT_VERIFY,
        data: { token },
      });

      // return res.render('../view/authPage/verify.ejs', {email: user.email});
    }

    // const refreshToken = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN
    // });
    res.cookie("token", token, { maxAge: 9000000, httpOnly: true });

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: { token, refreshToken },
    });

    // res.redirect('/product')
  },

  refreshAccessToken: async (req, res, next) => {
    const { refreshToken } = req.body;
    const decode = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_WRONG)
      );
    }

    const condition = {
      where: {
        id: decode.id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const user = await User.findOne(condition);

    if (!user) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: token,
    });
  },

  updatePW: async (req, res, next) => {
    const { oldPW, newPW, repeatNewPW } = req.body;

    if (!oldPW || !newPW || !repeatNewPW) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK));
    }

    if (newPW !== repeatNewPW) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_NOT_SAME)
      );
    }

    const condition = {
      where: {
        id: req.user,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const user = await User.findOne(condition);

    if (!user) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_LOGIN));
    }

    // if (await !Bcrypt.compareSync(oldPW, user.password))
    if (md5(oldPW) !== user.password) {
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_NOT_SAME)
      );
    }

    // user.password = Bcrypt.hashSync(newPW, DEFAULT_VALUE.SALT_BCRYPT)
    user.password = md5(newPW);
    await user.save();

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null,
    });
  },

  forgotPW: async (req, res, next) => {
    const { email } = req.body;

    if (!email)
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({ message: MESSAGE.INFOR_LACK });

    const condition = {
      where: {
        email: email,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const user = await User.findOne(condition);

    if (!user)
      return res
        .status(HTTP_CODE.BAD_REQUEST)
        .json({ message: MESSAGE.INFOR_WRONG });

    const reset = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_RESET_EXPIRES_IN,
    });

    const text = `Click vào đây để cập nhật mật khẩu mới!`;
    const link = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPW/${reset}`;
    const html = `<button style="background-color: rgb(105, 192, 233); width: 100px; height: 50px; border: 1px solid red">
      <a style="text-decoration: none; color: white; font-size: 15pxs;" href="${link}">Cập Nhật Ngay</a></button>`;

    sendMail(user.email, text, html);

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SEND_MAIL,
      data: link,
    });
  },

  resetPW: async (req, res, next) => {
    const { reset } = req.params;
    const { newPassword, repeatNewPassword } = req.body;

    if (!reset)
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );

    const decode = await jwt.verify(reset, process.env.JWT_SECRET_KEY);

    const condition = {
      where: {
        id: decode.id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const user = await User.findOne(condition);

    if (!user)
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );

    if (newPassword !== repeatNewPassword)
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.IS_NOT_SAME)
      );

    // user.password = await Bcrypt.hashSync(newPassword, 12);
    user.password = await md5(newPassword);

    await user.save();

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data: null,
    });
  },

  roleModule: async (req, res, next) => {
    const test = await RoleModule.create(req.body);

    res.send(test);
  },
};
