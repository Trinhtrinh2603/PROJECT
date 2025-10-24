const express = require("express");
const fs = require("fs");
const router = express.Router();

const CART_FILE = "./data/carts.json";

// Lấy giỏ hàng người dùng
router.get("/:username", (req, res) => {
    const username = req.params.username;
    const carts = JSON.parse(fs.readFileSync(CART_FILE, "utf8"));
    res.json(carts[username] || []);
});

// Thêm sản phẩm vào giỏ hàng
router.post("/:username", (req, res) => {
    const username = req.params.username;
    const { productId } = req.body;
    const carts = JSON.parse(fs.readFileSync(CART_FILE, "utf8"));

    if (!carts[username]) carts[username] = [];
    carts[username].push(productId);
    fs.writeFileSync(CART_FILE, JSON.stringify(carts, null, 2));
    res.json({ message: "Đã thêm vào giỏ hàng!" });
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/:username/:productId", (req, res) => {
    const { username, productId } = req.params;
    const carts = JSON.parse(fs.readFileSync(CART_FILE, "utf8"));
    if (carts[username]) {
        carts[username] = carts[username].filter(id => id != productId);
        fs.writeFileSync(CART_FILE, JSON.stringify(carts, null, 2));
    }
    res.json({ message: "Đã xóa khỏi giỏ hàng!" });
});

module.exports = router;
