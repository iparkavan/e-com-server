const Router = require("express");
const { getCurrentUser } = require("../controllers/user-controllers");

const router = Router();

router.get("/:userId", getCurrentUser);

module.exports = router;
