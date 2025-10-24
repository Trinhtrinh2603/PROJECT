// ===============================
// server.js
// ===============================
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // phục vụ file HTML/CSS/JS tĩnh

// ✅ Giả lập dữ liệu trong bộ nhớ
let users = [];
let products = [];
let orders = [];

// ===============================
// 1️⃣ API ĐĂNG KÝ
// ===============================
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Thiếu thông tin" });

  if (users.find(u => u.username === username))
    return res.status(400).json({ message: "Tài khoản đã tồn tại" });

  users.push({ username, password });
  res.json({ message: "Đăng ký thành công" });
});

// ===============================
// 2️⃣ API ĐĂNG NHẬP
// ===============================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại" });
  if (user.password !== password)
    return res.status(401).json({ message: "Sai mật khẩu" });

  res.json({ message: "Đăng nhập thành công", username });
});

// ===============================
// 3️⃣ API SẢN PHẨM
// ===============================

// Lấy tất cả sản phẩm
app.get("/products", (req, res) => {
  res.json(products);
});

// Tạo sản phẩm mới
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price)
    return res.status(400).json({ message: "Thiếu tên hoặc giá" });

  const newProduct = { id: Date.now(), name, price };
  products.push(newProduct);
  res.json({ message: "Tạo sản phẩm thành công", product: newProduct });
});

// ✅ LẤY THÔNG TIN MỘT SẢN PHẨM THEO ID
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  }
  res.json(product);
});

// ===============================
// 4️⃣ API ĐẶT HÀNG
// ===============================
app.post("/orders", (req, res) => {
  const { username, cart } = req.body;

  if (!username || !cart || Object.keys(cart).length === 0) {
    return res.status(400).json({ message: "Giỏ hàng trống hoặc thiếu thông tin" });
  }

  const newOrder = {
    id: Date.now(),
    username,
    cart,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  res.json({ message: "Đặt hàng thành công", order: newOrder });
});

// Xem danh sách đơn hàng
app.get("/orders", (req, res) => {
  res.json(orders);
});

// ===============================
// 5️⃣ KIỂM TRA SERVER
// ===============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===============================
// CHẠY SERVER
// ===============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
