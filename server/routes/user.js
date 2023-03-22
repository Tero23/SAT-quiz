const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.use(auth.protect);

router.post("/saveScore", userController.saveScore);
router.get("/logout", userController.logout);
router.get("/stats", userController.getUserStats);

module.exports = router;
