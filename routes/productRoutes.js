const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products or filter by brand
router.get("/", async (req, res) => {
  try {
    const brand = req.query.brand;
    let products;
    if (brand) {
      products = await Product.find({ brand: new RegExp(brand, "i") });
    } else {
      products = await Product.find();
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get a product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Create a new product
router.post("/", async (req, res) => {
  const {
    name,
    brand,
    size,
    price,
    description,
    image,
    additionalImages,
    colors,
  } = req.body;
  const product = new Product({
    name,
    brand,
    size,
    price,
    description,
    image,
    additionalImages,
    colors,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
