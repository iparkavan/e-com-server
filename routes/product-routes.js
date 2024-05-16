const Router = require("express");
const {
  postProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controllers");
const isAuth = require("../middleware/isAuth");

const router = Router();

router.get("/products", isAuth, getProducts);

router.post("/products/add-product", isAuth, postProduct);

router.get("/products/:productId", getProduct);

// router.put("/edit-product/:productId", updateProduct);

router.put("/edit-product", isAuth, updateProduct);

router.post("/delete-product", isAuth, deleteProduct);

module.exports = router;
