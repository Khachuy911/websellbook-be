const Comment = require("../model/commentModel");
const { getPagination, getSort, filter, search } = require("../helper/helper");
const { DEFAULT_VALUE, MESSAGE, HTTP_CODE } = require("../helper/constant");
const ErrorResponse = require("../helper/errorResponse");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

module.exports = {
  create: async (req, res, next) => {
    const { text, productId } = req.body;
    if (!text || !productId) {
      return next(new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.INFOR_LACK));
    }

    const userId = req.user;

    const data = {
      text,
      userId,
      productId,
    };

    const comment = new Comment(data);

    await comment.save();

    res.status(HTTP_CODE.CREATED).json({
      isSuccess: true,
      message: MESSAGE.CREATED,
      data: null,
    });
  },

  getComment: async (req, res, next) => {
    const condition = {
      where: {
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        ...filter("userId", req.query.userId),
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const comment = await Comment.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(comment.count / +pageSize),
      totalSize: comment.rows.length || 0,
      rows: comment.rows,
    };

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data,
    });
  },

  getCommentByProduct: async (req, res, next) => {
    const condition = {
      where: {
        productId: req.params.id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
        ...filter("userId", req.query.userId),
      },
      include: {
        model: User,
        required: false,
        where: { isDeleted: DEFAULT_VALUE.IS_NOT_DELETED },
      },
      ...getPagination(req.query.page),
      ...getSort(req.query.title, req.query.type),
    };

    const comment = await Comment.findAndCountAll(condition);

    const pageSize = req.query.pageSize || process.env.DEFAULT_LIMIT_PAGE;
    const data = {
      pageSize,
      pageIndex: req.query.page || process.env.DEFAULT_PAGE,
      totalPage: Math.ceil(comment.count / +pageSize),
      totalSize: comment.rows.length || 0,
      rows: comment.rows,
    };

    // 
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data,
        currentUser: 0
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const conditionAuth = {
      where: {
        id: decode.id,
        status: 1,
      },
    };
    const user = await User.findOne(conditionAuth);

    if (!user){
      res.status(HTTP_CODE.SUCCESS).json({
        isSuccess: true,
        message: MESSAGE.SUCCESS,
        data,
        currentUser: 0
      });
    }
    req.user = user;
    // 

    res.status(HTTP_CODE.SUCCESS).json({
      isSuccess: true,
      message: MESSAGE.SUCCESS,
      data,
      currentUser: req.user
    });
  },

  getDetail: async (req, res, next) => {
    const { id } = req.params;

    const condition = {
      where: {
        id: id,
        isDeleted: DEFAULT_VALUE.IS_NOT_DELETED,
      },
    };
    const comment = await Comment.findOne(condition);

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

      const comment = await Comment.findOne({ where: { id } });

      if (comment?.userId !== req.user) {
        return next(
          new ErrorResponse(HTTP_CODE.BAD_REQUEST, MESSAGE.KHONG_XOA_COMMENT)
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
