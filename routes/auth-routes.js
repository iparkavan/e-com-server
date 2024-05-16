const Router = require("express");
const {
  registerUser,
  checkLoginUser,
  verifyToken,
} = require("../controllers/auth-controllers");

const router = Router();

router.post("/register", registerUser);

router.post("/login", checkLoginUser);

router.get("/verify-token", verifyToken);

module.exports = router;
