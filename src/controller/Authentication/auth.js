const bcrypt = require("bcrypt");
const jwt = require("../../utils/jwt");
const User = require("../../model/User/userModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid email or password", 404));
  }

  const token = await jwt.sendToken(user.id);

  res.status(200).json({
    success: true,
    message: "login successful",
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  let {
    email,
    firstname,
    lastname,
    middlename,
    photo,
    password,
    confirmpassword,
    occupation,
  } = req.body;

  if (await User.findOne({ email })) {
    return next(new AppError("User already exist", 403));
  }
  if (password !== confirmpassword) {
    new AppError("Passwords are not the same", 404);
  }

  password = await bcrypt.hash(password, 13);

  const newUser = await User.create({
    email,
    firstName: firstname,
    lastName: lastname,
    middleName: middlename,
    password,
    occupation,
    photo,
  });

  res.status(201).json({
    success: true,
    message: "User created",
  });
});

exports.protected = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in", 403));
  }

  const userDecode = await jwt.decode(token);
  if (!userDecode) {
    return next(new AppError("Invalid token", 400));
  }

  const currentUser = await User.findById(userDecode)
    .select("+password")
    .populate({
      path: "forums",
      select: "-_id -__v",
    });

  if (!currentUser) {
    return next(new AppError("User not found, please sign in", 404));
  }
  req.user = currentUser;
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await req.user;

  const { password, newpassword, confirmpassword } = req.body;

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid password", 400));
  }

  if (newpassword != confirmpassword) {
    return next("Passwords are not the same", 400);
  }

  user.password = await bcrypt.hash(newpassword, 13);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
