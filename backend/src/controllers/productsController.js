const pool = require("../config/db");

// Get all products
const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
    } = req.body;

    const [result] = await pool.query(
      `
      INSERT INTO products
      (name, description, price, quantity)
      VALUES (?, ?, ?, ?)
      `,
      [name, description, price, quantity]
    );

    res.status(201).json({
      message: "Product created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      quantity,
    } = req.body;

    const [result] = await pool.query(
      `
      UPDATE products
      SET
        name = ?,
        description = ?,
        price = ?,
        quantity = ?
      WHERE id = ?
      `,
      [name, description, price, quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
