const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");

function getUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf8");
  return JSON.parse(data || "[]");
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });

  const users = getUsers();
  const existing = users.find((u) => u.username === username);
  if (existing)
    return res.status(400).json({ message: "Tài khoản đã tồn tại" });

  users.push({ username, password });
  saveUsers(users);
  res.json({ message: "Đăng ký thành công" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });
  if (user.password !== password)
    return res.status(400).json({ message: "Sai mật khẩu" });

  return res.json({ message: "Đăng nhập thành công", user });
});

module.exports = router;
