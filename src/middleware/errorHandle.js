const errorResponse = require('../helper/errorResponse');

function errorHandle(err, req, res, next) {
  let error = { ...err };
  error.message = err.message || "Server error";
  error.statusCode = err.statusCode || 500;
  if (error.message === "Validation error") {
    const message = "information already exists"
    error = new errorResponse(400, message);
  }
  // if (err.code === 11000) {
  //   const message = "information already exists";
  //   error = new errorResponse(400, message);
  // }
  if (err.name === "CastError") {
    const message = "not found link";
    error = new errorResponse(404, message);
  }
  if (err.name === "JsonWebTokenError") {
    const message = "jwt malformed";
    error = new errorResponse(401, message);
  }
  if (err.name === "TokenExpiredError") {
    const message = "jwt expired";
    error = new errorResponse(401, message);
  }
  res.status(error.statusCode).json({
    isSuccess: false,
    errorCode: error.message,
  });
}

module.exports = errorHandle;