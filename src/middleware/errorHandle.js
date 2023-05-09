const errorResponse = require('../helper/errorResponse');

function errorHandle(err, req, res, next) {
  let error = { ...err };
  error.message = err.message || "Server đang bảo trì.";
  error.statusCode = err.statusCode || 500;
  if (error.message === "Validation error") {
    const message = "Thông tin đã tồn tại"
    error = new errorResponse(400, message);
  }
  // if (err.code === 11000) {
  //   const message = "information already exists";
  //   error = new errorResponse(400, message);
  // }
  if (err.name === "CastError") {
    const message = "Không tìm thấy đường dẫn";
    error = new errorResponse(404, message);
  }
  if (err.name === "JsonWebTokenError") {
    const message = "Mã token không hợp lệ";
    error = new errorResponse(401, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "Mã token đã hết hạn";
    error = new errorResponse(401, message);
  }
  res.status(error.statusCode).json({
    isSuccess: false,
    errorCode: error.message,
  });
}

module.exports = errorHandle;