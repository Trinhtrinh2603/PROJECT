const express = require("express");
const router = express.Router();
const orderService = require("../services/orderService");

router.post("/", (req, res) => {
    try {
        const { username, productId } = req.body;
        res.json(orderService.createOrder(username, productId));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
