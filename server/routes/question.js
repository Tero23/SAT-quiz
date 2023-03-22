const router = require("express").Router();
const questionController = require("../controllers/question");
const auth = require("../middlewares/auth");

router
  .route("/")
  .get(auth.protect, questionController.getTenQuestions)
  .post(questionController.createQuestion);

module.exports = router;
