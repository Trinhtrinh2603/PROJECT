// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Lấy danh sách sản phẩm
router.get("/", productController.getAllProducts);

// Thêm sản phẩm
router.post("/", productController.createProduct);



module.exports = router;
