const User = require("../../model/User/userModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.getAUser = catchAsync(async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findById(user_id)
    .populate({
      path: "forums",
    })
    .select("-password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  const user = await req.user;

  res.status(200).json({
    success: true,
    data: { user },
  });
});
