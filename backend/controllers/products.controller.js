import Product from "../models/products.model.js";
import { mockProducts } from "../data/products.data.js";

export const createProduct = async (req, res) => {
  try {
    const product_created = await Product.create(req.body);
    if (product_created) {
      return res.status(201).json(product_created);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    let queryFilter = {};

    if (req.query.category) {
      queryFilter.category = req.query.category;
    }

    if (req.query.search) {
      queryFilter.name = { $regex: req.query.search, $options: "i" };
    }

    // Try MongoDB query first
    const find_all_product = await Product.find(queryFilter);

    if (find_all_product && find_all_product.length > 0) {
      return res.status(200).json({
        success: true,
        count: find_all_product.length,
        products: find_all_product,
      });
    }

    // Fallback to rich mockProducts if DB has not been seeded yet
    let filtered = [...mockProducts];
    if (req.query.category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      products: filtered,
    });
  } catch (error) {
    // Graceful fallback on connection/network timeout
    let filtered = [...mockProducts];
    if (req.query.category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      products: filtered,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;

    try {
      const product_found = await Product.findById(id);
      if (product_found) {
        return res.status(200).json(product_found);
      }
    } catch (e) {
      // id might not be standard mongo id if fallback used
    }

    const mockItem = mockProducts.find((p) => p._id === id);
    if (mockItem) {
      return res.status(200).json(mockItem);
    }

    return res.status(404).send("No product with such id");
  } catch (error) {
    res.status(400).send(error.message);
  }
};