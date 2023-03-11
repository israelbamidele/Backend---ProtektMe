const AppError = require("../../utils/appError");

const sendError = function (err, req, res, next) {
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    status: err.status,
    err: err.errors,
    error: err,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "An Error occured";

  sendError(err, req, res, next);
};
