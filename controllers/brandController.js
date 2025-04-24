const Brand = require("../models/brandModel");

exports.createBrand = (req, res) => {
  const { name } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name) return res.status(400).json({ error: "Name is required" });

  Brand.createBrand({ name, image }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Brand created", id: result.insertId });
  });
};

exports.getAllBrands = (req, res) => {
  Brand.getAllBrands((err, brands) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(brands);
  });
};

exports.getBrandById = (req, res) => {
  const brandId = req.params.id;
  Brand.getBrandById(brandId, (err, brand) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  });
};

exports.updateBrand = (req, res) => {
  const brandId = req.params.id;
  const { name } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name) return res.status(400).json({ error: "Name is required" });

  // Get old brand first (optional if you want to preserve image)
  Brand.getBrandById(brandId, (err, brand) => {
    if (err || !brand)
      return res.status(404).json({ error: "Brand not found" });

    const updatedImage = image || brand.image;

    Brand.updateBrand(brandId, { name, image: updatedImage }, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Brand updated" });
    });
  });
};

exports.deleteBrand = (req, res) => {
  const brandId = req.params.id;

  Brand.deleteBrand(brandId, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Brand deleted" });
  });
};
