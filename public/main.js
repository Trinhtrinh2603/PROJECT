// ===============================
// main.js
// ===============================

// Xác định trang hiện tại
const currentPage = window.location.pathname.split("/").pop();
const API_URL = "http://localhost:3000"; // đường dẫn backend

// =============== ĐĂNG KÝ ===============
if (currentPage === "register.html") {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đăng ký thành công! Hãy đăng nhập.");
                window.location.href = "login.html";
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Lỗi kết nối server!");
        }
    });
}

// =============== ĐĂNG NHẬP ===============
if (currentPage === "login.html") {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("username", username);
                alert("Đăng nhập thành công!");
                window.location.href = "products.html";
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Lỗi kết nối server!");
        }
    });
}

// =============== TRANG QUẢN LÝ SẢN PHẨM ===============
if (currentPage === "products.html") {
    const productForm = document.getElementById("productForm");
    const productList = document.getElementById("productList");
    const cartSection = document.getElementById("cartSection");
    const cartList = document.getElementById("cartList");
    const viewCartBtn = document.getElementById("viewCartBtn");
    const orderBtn = document.getElementById("orderBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const welcome = document.getElementById("welcome");

    let products = [];
    let cart = {};

    const username = localStorage.getItem("username");

    if (!username) {
        document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
        <h2>Bạn chưa đăng nhập!</h2>
        <p>Đang chuyển đến trang đăng nhập...</p>
      </div>`;
        setTimeout(() => (window.location.href = "login.html"), 1000);
    } else {
        welcome.textContent = "Xin chào, " + username + "!";
        loadUserProducts();
    }

    // 🟢 Thêm sản phẩm (gửi lên server)
    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const price = parseFloat(document.getElementById("price").value);

        if (!name || price <= 0) {
            alert("Vui lòng nhập tên và giá hợp lệ!");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price }),
            });
            const data = await res.json();

            if (res.ok) {
                alert("Thêm sản phẩm thành công!");
                loadUserProducts();
                productForm.reset();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Không thể kết nối tới server!");
        }
    });

    // 🟢 Hiển thị sản phẩm
    function renderProducts() {
        productList.innerHTML = "";
        products.forEach((p) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${p.name} - ${p.price.toLocaleString()}₫</span>
                <button class="add-btn" onclick="addToCart('${p.name}', ${p.price})">+</button>
            `;
            productList.appendChild(li);
        });
    }

    // 🟢 Lấy danh sách sản phẩm từ server
    async function loadUserProducts() {
        try {
            const res = await fetch(`${API_URL}/products`);
            products = await res.json();
            renderProducts();
        } catch (error) {
            alert("Không thể tải danh sách sản phẩm!");
        }
    }

    // 🟢 Giỏ hàng
    window.addToCart = function (name, price) {
        if (cart[name]) cart[name].quantity++;
        else cart[name] = { price, quantity: 1 };
        renderCart();
    };

    window.removeFromCart = function (name) {
        if (cart[name]) {
            cart[name].quantity--;
            if (cart[name].quantity <= 0) delete cart[name];
        }
        renderCart();
    };

    function renderCart() {
        cartList.innerHTML = "";
        let total = 0;

        Object.entries(cart).forEach(([name, item]) => {
            const li = document.createElement("li");
            li.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <div style="flex:1;">
            <strong>${name}</strong><br>
            <small>${item.price.toLocaleString()}₫ x ${item.quantity}</small>
          </div>
          <div style="display:flex; align-items:center; gap:5px;">
            <button class="remove-btn" onclick="removeFromCart('${name}')">−</button>
            <span>${item.quantity}</span>
            <button class="add-btn" onclick="addToCart('${name}', ${item.price})">+</button>
          </div>
          <div style="width:80px; text-align:right;">
            <strong>${(item.price * item.quantity).toLocaleString()}₫</strong>
          </div>
        </div>`;
            cartList.appendChild(li);
            total += item.price * item.quantity;
        });

        if (Object.keys(cart).length > 0) {
            const totalLi = document.createElement("li");
            totalLi.innerHTML = `<strong>Tổng cộng: ${total.toLocaleString()}₫</strong>`;
            cartList.appendChild(totalLi);
        }
    }

    viewCartBtn.addEventListener("click", () => {
        cartSection.style.display = "block";
        renderCart();
    });

    // 🟢 Gửi đơn hàng lên server
    orderBtn.addEventListener("click", async () => {
        if (Object.keys(cart).length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, cart }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đặt hàng thành công!");
                cart = {};
                renderCart();
                cartSection.style.display = "none";
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Lỗi kết nối server khi đặt hàng!");
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
}
