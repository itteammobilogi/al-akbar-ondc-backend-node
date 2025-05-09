// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // === 1. For product images ===
// const productStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = "uploads/";
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });
// const uploadProduct = multer({ storage: productStorage });

// // === 2. For brand images ===
// const brandStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = "uploads/brands";
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });
// const uploadBrand = multer({ storage: brandStorage });

// module.exports = {
//   uploadProduct,
//   uploadBrand,
// };

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === 1. For product images ===
const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadProduct = multer({ storage: productStorage }).fields([
  { name: "images", maxCount: 10 },
  { name: "variantImages", maxCount: 10 },
]);

// === 2. For brand images ===
const brandStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/brands";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadBrand = multer({ storage: brandStorage });

module.exports = {
  uploadProduct,
  uploadBrand,
};
