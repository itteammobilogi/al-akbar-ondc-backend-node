// controllers/productController.js
const Product = require("../models/productModel");

// exports.createProduct = (req, res) => {
//   const {
//     name,
//     description,
//     price,
//     discountPrice,
//     offerType,
//     categoryId,
//     brand,
//     sizes,
//     colors,
//     stock,
//     isFeatured,
//     is_exclusive,
//   } = req.body;

//   // Convert uploaded images to array of URLs
//   const images = req.files
//     ? req.files.map((file) => `/uploads/${file.filename}`)
//     : [];

//   // Validations
//   if (!name || !price || !categoryId) {
//     return res
//       .status(400)
//       .json({ error: "Name, price, and categoryId are required." });
//   }

//   if (isNaN(price) || (discountPrice && isNaN(discountPrice))) {
//     return res
//       .status(400)
//       .json({ error: "Price and discountPrice must be valid numbers." });
//   }

//   if (stock && isNaN(stock)) {
//     return res.status(400).json({ error: "Stock must be a number." });
//   }

//   const productData = {
//     name,
//     description,
//     price,
//     discountPrice: discountPrice || null,
//     offerType: offerType || null,
//     categoryId,
//     brand: brand || "",
//     sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
//     colors: colors ? colors.split(",").map((c) => c.trim()) : [],
//     images,
//     stock: stock || 0,
//     isFeatured: isFeatured ? 1 : 0,
//     is_exclusive: is_exclusive ? 1 : 0,
//   };

//   Product.createProduct(productData, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(201).json({
//       message: "Product created successfully!",
//       productId: result.insertId,
//     });
//   });
// };

exports.createProduct = (req, res) => {
  try {
    // 1) Pull out text fields
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
      is_exclusive,
      variants,
    } = req.body;

    // 2) Validate required
    if (!name || !price || !categoryId) {
      return res
        .status(400)
        .json({ error: "name, price and categoryId are required." });
    }

    // 3) Build arrays from strings
    const sizesArr = sizes ? JSON.parse(sizes) : [];
    const colorsArr = colors ? JSON.parse(colors) : [];
    const variantsArr = variants ? JSON.parse(variants) : [];

    // 4) Map uploaded files → URLs
    const imagesArr = (req.files.images || []).map(
      (f) => `/uploads/${f.filename}`
    );

    // 5) Attach variant images if provided
    const variantImages = req.files.variantImages || [];
    const completeVariants = variantsArr.map((v, idx) => ({
      color: v.color,
      stock: v.stock,
      image: variantImages[idx]
        ? `/uploads/${variantImages[idx].filename}`
        : v.image || "",
    }));

    // 6) Assemble final data object
    const productData = {
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      offerType: offerType || null,
      categoryId: parseInt(categoryId, 10),
      brand: brand || "",
      sizes: sizesArr,
      colors: colorsArr,
      images: imagesArr,
      stock: parseInt(stock, 10) || 0,
      isFeatured: Boolean(+isFeatured),
      is_exclusive: Boolean(+is_exclusive),
      variants: completeVariants,
    };

    // 7) Delegate to the model
    Product.createProduct(productData, (err, result) => {
      if (err) {
        console.error("createProduct error:", err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Product created successfully",
        productId: result.productId,
      });
    });
  } catch (err) {
    console.error("createProduct controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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

// exports.updateProduct = (req, res) => {
//   const productId = req.params.id;
//   if (!productId) {
//     return res.status(400).json({ error: "Product ID is required." });
//   }

//   const {
//     name,
//     description,
//     price,
//     discountPrice,
//     offerType,
//     categoryId,
//     brand,
//     sizes,
//     colors,
//     stock,
//     isFeatured,
//     is_exclusive,
//   } = req.body;

//   const images = req.files
//     ? req.files.map((file) => `/uploads/${file.filename}`)
//     : [];

//   const productData = {};

//   if (name) productData.name = name;
//   if (description) productData.description = description;
//   if (price) productData.price = parseFloat(price);
//   if (discountPrice) productData.discountPrice = parseFloat(discountPrice);
//   if (offerType) productData.offerType = offerType;
//   if (categoryId) productData.categoryId = categoryId;
//   if (brand) productData.brand = brand;

//   if (sizes)
//     productData.sizes = JSON.stringify(sizes.split(",").map((s) => s.trim()));

//   if (colors)
//     productData.colors = JSON.stringify(colors.split(",").map((c) => c.trim()));

//   if (images.length > 0) productData.images = JSON.stringify(images);

//   if (stock) productData.stock = parseInt(stock);
//   productData.isFeatured = isFeatured === "on" ? 1 : 0;
//   productData.is_exclusive = is_exclusive === "on" ? 1 : 0;

//   Product.updateProduct(productId, productData, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Product not found." });
//     }

//     res.status(200).json({ message: "Product updated successfully." });
//   });
// };

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
    is_exclusive,
    variants,
  } = req.body;

  const images = req.files?.images?.map((f) => `/uploads/${f.filename}`) || [];

  // 📌 NEW: Handle variantImages
  const variantImages = req.files?.variantImages || [];

  const parsedVariants = variants ? JSON.parse(variants) : [];

  const completeVariants = parsedVariants.map((v, i) => ({
    color: v.color,
    stock: v.stock,
    image: variantImages[i]
      ? `/uploads/${variantImages[i].filename}`
      : v.image || "", // fallback to existing image if not re-uploaded
  }));

  const productData = {};

  if (name) productData.name = name;
  if (description) productData.description = description;
  if (price) productData.price = parseFloat(price);
  if (discountPrice) productData.discountPrice = parseFloat(discountPrice);
  if (offerType) productData.offerType = offerType;
  if (categoryId) productData.categoryId = categoryId;
  if (brand) productData.brand = brand;
  if (sizes)
    productData.sizes = JSON.stringify(sizes.split(",").map((s) => s.trim()));
  if (colors)
    productData.colors = JSON.stringify(colors.split(",").map((c) => c.trim()));
  if (images.length > 0) productData.images = JSON.stringify(images);
  if (stock) productData.stock = parseInt(stock);
  productData.isFeatured = isFeatured == "1" ? 1 : 0;
  productData.is_exclusive = is_exclusive == "1" ? 1 : 0;

  productData.variants = JSON.stringify(completeVariants);

  Product.updateProduct(productId, productData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully." });
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  if (!productId) return res.status(400).json({ error: "Missing product ID" });

  Product.deleteProduct(productId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Product and its order items deleted." });
  });
};
