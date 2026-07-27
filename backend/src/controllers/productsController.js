const pool = require("../config/db");
const redisClient = require("../config/redis");

const PRODUCTS_CACHE_KEY = "products:all";
const CACHE_TTL = Number(process.env.CACHE_TTL) || 60;

// ==============================
// Get all products
// ==============================

const getProducts = async (req, res) => {
  try {
    // Check Redis Cache
    const cachedProducts = await redisClient.get(PRODUCTS_CACHE_KEY);

    if (cachedProducts) {
      console.log("⚡ Products loaded from Redis");

      return res.json(JSON.parse(cachedProducts));
    }

    // Cache Miss → Query MySQL
    console.log("📦 Products loaded from MySQL");

    const [rows] = await pool.query("SELECT * FROM products");

    // Save to Redis
    await redisClient.set(
      PRODUCTS_CACHE_KEY,
      JSON.stringify(rows),
      {
        EX: CACHE_TTL,
      }
    );

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// ==============================
// Get product by ID
// ==============================

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

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// ==============================
// Create product
// ==============================

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

    // Clear Cache
    await redisClient.del(PRODUCTS_CACHE_KEY);

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

// ==============================
// Update product
// ==============================

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

    // Clear Cache
    await redisClient.del(PRODUCTS_CACHE_KEY);

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

// ==============================
// Delete product
// ==============================

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

    // Clear Cache
    await redisClient.del(PRODUCTS_CACHE_KEY);

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
