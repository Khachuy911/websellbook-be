const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const Role = require("../model/roleModel");
const UserRole = require("../model/userRoleModel");
const RoleModule = require("../model/roleModuleModel");
const ErrorResponse = require("../helper/errorResponse");
const { DEFAULT_VALUE, HTTP_CODE, MESSAGE } = require("../helper/constant");

module.exports.checkToken = async (req, res, next) => {
  try {
    let token;
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    //   token = req.headers.authorization.split(' ')[1];\
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.redirect("/auth/views/login");
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_LOGIN));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const condition = {
      where: {
        id: decode.id,
        status: 1,
      },
    };
    const user = await User.findOne(condition);

    if (!user)
      return next(
        new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
    let { password, ...data } = user.dataValues;
    req.user = data.id;
    req.currentUser = data;

    next();
  } catch (error) {
    return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error?.message));
  }
};

module.exports.permission = (url, ...role) => {
  return async (req, res, next) => {
    try {
      const userId = req.user;

      const condition = {
        where: {
          userId: userId,
          isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        },
        include: {
          model: Role,
          where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          right: true,
          include: {
            model: RoleModule,
            right: true,
            // where: { api: req.originalUrl, isDeleted: DEFAULT_VALUE.IS_NOT_DELETED }
            where: { api: url, isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
          },
        },
      };

      const userRole = await UserRole.findAll(condition);

      const map = new Map();
      userRole.forEach((ele) => {
        if (ele.Role.RoleModules[0].isCanRead === 1)
          map.set("isCanRead", ele.Role.RoleModules[0].isCanRead);
        if (ele.Role.RoleModules[0].isCanEdit === 1)
          map.set("isCanEdit", ele.Role.RoleModules[0].isCanEdit);
        if (ele.Role.RoleModules[0].isCanDelete === 1)
          map.set("isCanDelete", ele.Role.RoleModules[0].isCanDelete);
        if (ele.Role.RoleModules[0].isCanAdd === 1)
          map.set("isCanAdd", ele.Role.RoleModules[0].isCanAdd);
      });

      let count = 0;
      role.forEach((ele) => {
        if (!map.has(ele)) count++;
      });

      count === 0
        ? next()
        : next(
            new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.NOT_PERMISSTION)
          );
    } catch (error) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, error.message));
    }
  };
};
