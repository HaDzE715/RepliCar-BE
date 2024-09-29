const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController"); // Import the controller

// Get a product by discount
router.get("/discounted", productController.getProductByDiscount);
// Get all products or filter by brand
router.get("/", productController.getAllProducts);

// Get a product by ID
router.get("/:id", productController.getProductById);

// Create a new product
router.post("/", productController.createProduct);

// Update a product by ID
router.put("/:id", productController.updateProduct);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

module.exports = router;
