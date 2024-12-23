const express = require("express");
const mongoose = require("mongoose");
 const router = express.Router();
const Product = require("../models/product");
// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Update a product
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product (soft delete)
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
