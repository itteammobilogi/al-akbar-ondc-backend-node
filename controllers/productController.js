// controllers/productController.js
const Product = require("../models/productModel");

exports.createProduct = (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    offerType,
    categoryId,
    brand,
    sizes,
    colors,
    stock,
    isFeatured,
  } = req.body;

  // Convert uploaded images to array of URLs
  const images = req.files
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : [];

  // Validations
  if (!name || !price || !categoryId) {
    return res
      .status(400)
      .json({ error: "Name, price, and categoryId are required." });
  }

  if (isNaN(price) || (discountPrice && isNaN(discountPrice))) {
    return res
      .status(400)
      .json({ error: "Price and discountPrice must be valid numbers." });
  }

  if (stock && isNaN(stock)) {
    return res.status(400).json({ error: "Stock must be a number." });
  }

  const productData = {
    name,
    description,
    price,
    discountPrice: discountPrice || null,
    offerType: offerType || null,
    categoryId,
    brand: brand || "",
    sizes: sizes ? JSON.parse(sizes) : [],
    colors: colors ? JSON.parse(colors) : [],
    images,
    stock: stock || 0,
    isFeatured: isFeatured || false,
  };

  Product.createProduct(productData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "Product created successfully!",
      productId: result.insertId,
    });
  });
};

exports.getAllProducts = (req, res) => {
  const filters = req.query;
  Product.getAllProducts(filters, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// exports.getProductById = (req, res) => {
//   Product.getProductById(req.params.id, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (results.length === 0)
//       return res.status(404).json({ message: "Product not found" });
//     res.json(results[0]);
//   });
// };

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required." });
  }

  const {
    name,
    description,
    price,
    discountPrice,
    offerType,
    categoryId,
    brand,
    sizes,
    colors,
    stock,
    isFeatured,
  } = req.body;

  const images = req.files
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : [];

  const productData = {};

  if (name) productData.name = name;
  if (description) productData.description = description;
  if (price) productData.price = parseFloat(price);
  if (discountPrice) productData.discountPrice = parseFloat(discountPrice);
  if (offerType) productData.offerType = offerType;
  if (categoryId) productData.categoryId = categoryId;
  if (brand) productData.brand = brand;
  if (sizes) productData.sizes = JSON.stringify(JSON.parse(sizes));
  if (colors) productData.colors = JSON.stringify(JSON.parse(colors));
  if (images.length > 0) productData.images = JSON.stringify(images);

  if (stock) productData.stock = parseInt(stock);
  if (typeof isFeatured !== "undefined") productData.isFeatured = isFeatured;

  Product.updateProduct(productId, productData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully." });
  });
};

exports.deleteProduct = (req, res) => {
  Product.deleteProduct(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
};
