const products = [
    // 1. Pastries
    {
        id: 1,
        name: "Classic Butter Croissant",
        category: "pastries",
        categoryLabel: "Pastries",
        price: 5.50,
        image: "images/pastry1.jpg",
        description: "Crisp, flaky golden layers with a soft, airy butter center."
    },
    {
        id: 2,
        name: "Almond Cream Danish",
        category: "pastries",
        categoryLabel: "Pastries",
        price: 6.25,
        image: "images/pastry2.jpg",
        description: "Tender pastry filled with sweet almond cream and toasted flakes."
    },
    {
        id: 3,
        name: "Morning Brioche Swirl",
        category: "pastries",
        categoryLabel: "Pastries",
        price: 5.75,
        image: "images/pastry3.jpg",
        description: "Soft, rich brioche baked until golden for slow morning coffee."
    },

    // 2. Cakes
    {
        id: 4,
        name: "Vanilla Bean Sponge Slice",
        category: "cakes",
        categoryLabel: "Cakes",
        price: 8.50,
        image: "images/cake1.jpg",
        description: "Light, moist vanilla sponge layered with silky cream."
    },
    {
        id: 5,
        name: "Salted Caramel Layer Cake",
        category: "cakes",
        categoryLabel: "Cakes",
        price: 9.50,
        image: "images/cake2.jpg",
        description: "Tender cake layers finished with smooth caramel and a hint of sea salt."
    },
    {
        id: 6,
        name: "Spiced Orchard Loaf",
        category: "cakes",
        categoryLabel: "Cakes",
        price: 7.75,
        image: "images/cake3.jpg",
        description: "Cozy homemade loaf infused with warm cinnamon and orchard fruit."
    },

    // 3. Cookies
    {
        id: 7,
        name: "Dark Chunk Chocolate Cookie",
        category: "cookies",
        categoryLabel: "Cookies",
        price: 4.50,
        image: "images/cookie1.jpg",
        description: "Crisp edges and a soft center packed with rich dark chocolate chunks."
    },
    {
        id: 8,
        name: "Brown Butter Oat Cookie",
        category: "cookies",
        categoryLabel: "Cookies",
        price: 4.25,
        image: "images/cookie2.jpg",
        description: "Nutty brown butter and rolled oats baked for a chewy, comforting bite."
    },
    {
        id: 9,
        name: "Cinnamon Sugar Shortbread",
        category: "cookies",
        categoryLabel: "Cookies",
        price: 4.75,
        image: "images/cookie3.jpg",
        description: "Delicate, crumbly butter shortbread dusted with warm cinnamon sugar."
    },

    // 4. Sweets
    {
        id: 10,
        name: "Warm Cinnamon Roll",
        category: "sweets",
        categoryLabel: "Sweets",
        price: 6.50,
        image: "images/sweet1.jpg",
        description: "Soft rolled dough swirled with cinnamon sugar and light glaze."
    },
    {
        id: 11,
        name: "Honeyed Fig Tartlet",
        category: "sweets",
        categoryLabel: "Sweets",
        price: 7.25,
        image: "images/sweet2.jpg",
        description: "Crisp pastry shell filled with smooth cream and sweet figs."
    },
    {
        id: 12,
        name: "Cocoa Truffle Bake",
        category: "sweets",
        categoryLabel: "Sweets",
        price: 6.75,
        image: "images/sweet3.jpg",
        description: "Rich, fudgy cocoa treat made for quiet evening cravings."
    }
];

let cart = [];

const productsGrid = document.getElementById("products-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const toastEl = document.getElementById("toast");

function renderProducts(category = "all") {
    const filtered = category === "all"
        ? products
        : products.filter(item => item.category === category);

    productsGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-img-box">
                <span class="category-tag">${product.categoryLabel}</span>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add to Bag</button>
                </div>
            </div>
        </article>
    `).join("");
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.category);
    });
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    showToast(`${product.name} added to your bag`);
}

function updateQty(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartCountEl.textContent = totalCount;
    cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="empty-msg">Your bag is currently empty.</p>`;
        return;
    }

    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span>$${(item.price * item.qty).toFixed(2)}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join("");
}

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your bag is empty.");
        return;
    }
    showToast("Thank you for visiting NEXORA Bakery!");
    cart = [];
    updateCartUI();
    closeCart();
});

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2500);
}

renderProducts();
updateCartUI();