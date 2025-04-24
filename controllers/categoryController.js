const Category = require("../models/categoryModel");

exports.getAllCategories = (req, res) => {
  Category.getAllCategories((err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
};

exports.getCategoryById = (req, res) => {
  Category.getCategoryById(req.params.id, (err, category) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  });
};

exports.createCategory = (req, res) => {
  const { name, description } = req.body;
  if (!name)
    return res.status(400).json({ error: "Category name is required" });

  Category.createCategory({ name, description }, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Category created successfully", id: result.insertId });
  });
};

exports.updateCategory = (req, res) => {
  const { name, description } = req.body;
  const id = req.params.id;

  Category.updateCategory(id, { name, description }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category updated successfully" });
  });
};

exports.deleteCategory = (req, res) => {
  Category.deleteCategory(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category deleted successfully" });
  });
};
