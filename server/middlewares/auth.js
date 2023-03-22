require("dotenv").config();
const { promisify } = require("util");
const { user: User } = require("../models/index");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError("You are not logged in!", 401));

  // 2) Validate token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  // 3) Check if user still exists
  const user = await User.findOne({ where: { id: decoded.id } });
  if (!user)
    return next(
      new AppError("The user belonging to the token does no longer exist!", 401)
    );
  // Grant access to protected route
  req.user = user;
  next();
});
