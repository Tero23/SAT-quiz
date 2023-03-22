const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/AppError");
const questionRouter = require("./routes/question");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/questions", questionRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
