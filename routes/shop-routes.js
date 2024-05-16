const Router = require("express");
const {
  getProducts,
  postCart,
  getCart,
} = require("../controllers/shop-controllers");

const router = Router();

router.get("/", getProducts);
router.get("/cart", getCart);
router.post("/cart", postCart);

// router.post("/products/add-product", );

// router.get("/products/:productId", );

module.exports = router;
