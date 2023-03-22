const { promisify } = require("util");
const { user: User } = require("../models/index");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");

exports.register = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.create({
    id: v4(),
    username,
    password,
  });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res
    .cookie("jwt", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true })
    .status(201)
    .json({
      status: "success",
      user,
    });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return next(new AppError("Invalid email/password", 400));
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Invalid email/password", 400));
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res
    .cookie("jwt", token, { maxAge: 5 * 60 * 60 * 1000, httpOnly: true })
    .status(200)
    .json({
      status: "success",
      message: "Logged In successfully!",
      user,
    });
});

exports.logout = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("jwt")
    .json({
      status: "success",
      message: `${req.user.username} logged out successfully`,
    });
});

exports.saveScore = catchAsync(async (req, res, next) => {
  console.log(new Date(Date.now()) - new Date(req.user.updatedAt).getTime());
  if (new Date(Date.now()) - new Date(req.user.updatedAt).getTime() < 1000)
    return next(new AppError("One at a time!", 400));
  const { score } = req.body;
  req.user.scores = [...req.user.scores, score];
  await req.user.save();
  res.status(200).json({ msg: "Score added successfully!" });
});

exports.getUserStats = catchAsync(async (req, res, next) => {
  const scores = req.user.scores;
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const sum = scores.reduce((acc, el) => acc + el, 0);
  const avg = Math.round((sum / scores.length) * 100) / 100;
  res.status(200).json({
    name: req.user.username,
    attempts: scores.length,
    max,
    min,
    avg,
  });
});
