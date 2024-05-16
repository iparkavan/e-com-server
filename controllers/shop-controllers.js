const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const e = require("express");

exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  if (products) {
    return res.status(201).json(products);
  } else {
    return res.status(404).json({ message: "Data Not Found" });
  }
});

exports.getCart = asyncHandler(async (req, res, next) => {
  const cartData = req.user.cart.items;
  res.json(cartData);
});

exports.postCart = asyncHandler(async (req, res, next) => {
  const prodId = req.body.prodId;

  if (prodId) {
    const cartProduct = await Product.findById(prodId);
    return req.user.addToCart(cartProduct);
  }
});

exports.removeItemfromCart = asyncHandler(async (req, res, next) => {
  const prodId = req.body;

  req.user.removeFromCart(prodId).then(() => {
    res.status(200).json({message: "Product Deleted"})
  })
});
