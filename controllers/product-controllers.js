const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const User = require("../models/user");
const { Schema } = require("mongoose");

exports.getProducts = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const products = [];
    for (const productId of user.products) {
      const product = await Product.findById(productId);
      products.push(product);
    }

    // console.log(products);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

exports.postProduct = asyncHandler(async (req, res, next) => {
  const { productTitle, description, price, imageUrl } = req.body;

  if (!productTitle && !description && !price && !imageUrl) {
    const error = new Error("All Fields are mandatory");
    return res.status(400).json(error);
  }

  try {
    const product = new Product({
      productTitle,
      description,
      price,
      imageUrl,
      creator: req.userId,
    });
    await product.save();
    const user = await User.findById(req.userId);
    user.products.push(product);
    await user.save();

    return res.status(201).json({
      message: "Product Created Successfully",
      creator: { _id: user._id, creatorName: user.username },
      product,
    });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const prodId = req.params.productId;

  if (!prodId) {
    return res.status(404).json({
      message: "Unable to fetch a product details without Product Id",
    });
  }

  const productDetails = await Product.findById(prodId);
  return res.status(201).json({ productDetails });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { prodId, productTitle, description, price, imageUrl } = req.body;

  const product = await Product.findById(prodId);

  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }

  if (product.creator.toString() !== req.userId) {
    const error = new Error("Not Authorized");
    return res.status(403).json(error.message);
  }

  product.productTitle = productTitle;
  product.price = price;
  product.description = description;
  product.imageUrl = imageUrl && imageUrl;
  return await product.save();
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const prodId = req.body.prodId;

  if (!prodId) {
    return res.status(404).json({
      message: "Unable to fetch a product details without Product Id",
    });
  }

  const product = await Product.findById(prodId);

  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }

  if (product.creator.toString() !== req.userId) {
    const error = new Error("Not Authorized");
    return res.status(403).json(error.message);
  }

  await Product.findByIdAndDelete(prodId);

  const user = await User.findById(req.userId);
  user.products.pull(prodId);
  await user.save();

  return res.status(201).json({ message: "Product Deleted Successfully" });
});
