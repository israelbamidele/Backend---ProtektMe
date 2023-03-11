const jwt = require("jsonwebtoken");

exports.sendToken = async function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

exports.decode = async function (token) {
  return jwt.verify(token, process.env.JWT_SECRET);
};
