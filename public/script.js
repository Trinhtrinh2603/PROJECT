let cart = {};

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].quantity++;
    } else {
        cart[name] = { price: price, quantity: 1 };
    }
    renderCart();
}

function removeFromCart(name) {
    if (cart[name]) {
        cart[name].quantity--;
        if (cart[name].quantity <= 0) delete cart[name];
    }
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    let total = 0;
    for (let [name, item] of Object.entries(cart)) {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <div class="cart-info">
                <span class="cart-name">${name}</span>
                <span class="cart-price">${item.price.toLocaleString()}₫</span>
            </div>
            <div class="cart-controls">
                <button onclick="removeFromCart('${name}')">−</button>
                <span>${item.quantity}</span>
                <button onclick="addToCart('${name}', ${item.price})">+</button>
            </div>
            <div class="cart-total">
                ${(item.price * item.quantity).toLocaleString()}₫
            </div>
        `;
        cartContainer.appendChild(row);
        total += item.price * item.quantity;
    }

    document.getElementById('total-price').innerText = total.toLocaleString() + '₫';
}

function showCart() {
    document.getElementById('product-page').style.display = 'none';
    document.getElementById('cart-page').style.display = 'block';
    renderCart();
}

function showProducts() {
    document.getElementById('cart-page').style.display = 'none';
    document.getElementById('product-page').style.display = 'block';
}
