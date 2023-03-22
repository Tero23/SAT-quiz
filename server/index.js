require("dotenv").config();
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception!!! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App listening on port: ${port}`));

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  app.close(() => {
    process.exit(1);
  });
});
