// ════════════════════════════════════════════════════════════
//  THE GRAND CELLAR — script.js
//  Products CRUD + Cart
// ════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
//  PRODUCTS DATA
// ════════════════════════════════════════════════════════════
let products = [
  {
    id: 1,
    name: "Rose Wine\nSyrah Blend",
    price: 129,
    cat: "Rosé",
    desc: "A delicate, fruit-forward rosé with notes of strawberry, rose petal, and a hint of spice.",
    img: "Images/img5.png"
  },
  {
    id: 2,
    name: "Rose Wine\nStrawberry",
    price: 149,
    cat: "Rosé",
    desc: "Bursting with fresh strawberry and watermelon, this rosé is crisp, refreshing, and elegant.",
    img: "Images/img8.png"
  },
  {
    id: 3,
    name: "Sauvignon\nBlanc",
    price: 179,
    cat: "White Wine",
    desc: "Bright citrus and passion fruit with a clean, minerally finish. A classic white wine.",
    img: "Images/img10.png"
  },
  {
    id: 4,
    name: "Reserve\nChardonnay",
    price: 189,
    cat: "White Wine",
    desc: "Rich and creamy with notes of vanilla, butter, and toasted oak. Aged 12 months in French oak.",
    img: "Images/img7.png"
  },
  {
    id: 5,
    name: "Cabernet\nSauvignon",
    price: 209,
    cat: "Red Wine",
    desc: "Bold dark fruit, cedar, and a velvety finish. Our flagship red — aged 18 months in oak barrels.",
    img: "Images/img6.png"
  }
];

// ── Next ID tracker
let nextId = 6;

// ════════════════════════════════════════════════════════════
//  CART STATE
// ════════════════════════════════════════════════════════════
let cart = {};   // { productId: { ...product, qty } }

// ════════════════════════════════════════════════════════════
//  DELETE STATE
// ════════════════════════════════════════════════════════════
let deleteTargetId = null;

// ════════════════════════════════════════════════════════════
//  EDIT STATE
// ════════════════════════════════════════════════════════════
let editTargetId = null;   // null = add mode, number = edit mode

// ════════════════════════════════════════════════════════════
//  RENDER PRODUCTS
// ════════════════════════════════════════════════════════════
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";

  if (!products.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:80px; color:var(--gray);">
        <i class="fa-solid fa-wine-bottle" style="font-size:48px; color:var(--green); margin-bottom:16px; display:block;"></i>
        <p style="font-size:16px;">Cellar is empty. Add your first wine!</p>
      </div>`;
    return;
  }

  products.forEach((p, i) => {
    const displayName = p.name.replace(/\n/g, "<br/>");
    const card = document.createElement("div");
    card.className = "p-card";
    card.style.animationDelay = `${i * 0.07}s`;

    card.innerHTML = `
      <div class="p-card-img">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='Images/img5.png'"/>
        ${p.cat ? `<span class="p-cat-badge">${p.cat}</span>` : ""}
        <div class="p-card-actions">
          <button class="action-btn edit" onclick="openEditModal(${p.id})" title="Edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="action-btn del" onclick="openDeleteModal(${p.id})" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="p-card-body">
        <div class="p-name">${displayName}</div>
        <div class="p-desc">${p.desc}</div>
        <div class="p-card-footer">
          <span class="p-price">$${p.price}</span>
          <button class="btn-cart-add" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-cart-plus"></i> Add
          </button>
        </div>
      </div>`;

    grid.appendChild(card);
  });
}

// ════════════════════════════════════════════════════════════
//  CART FUNCTIONS
// ════════════════════════════════════════════════════════════
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { ...p, qty: 1 };
  }
  renderCart();
  showToast(`🍷 ${p.name.replace("\n", " ")} added!`, "success");
}

function removeFromCart(id) {
  delete cart[id];
  renderCart();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  // Badge
  const badge = document.getElementById("cartBadge");
  badge.style.display = count ? "flex" : "none";
  badge.textContent = count;

  const body  = document.getElementById("cartBody");
  const empty = document.getElementById("cartEmpty");
  const foot  = document.getElementById("cartFoot");

  // Remove old items
  body.querySelectorAll(".cart-item").forEach(el => el.remove());

  if (!items.length) {
    empty.style.display = "flex";
    foot.style.display  = "none";
    return;
  }

  empty.style.display = "none";
  foot.style.display  = "block";

  document.getElementById("cartSub").textContent   = `$${total}`;
  document.getElementById("cartTotal").textContent  = `$${total}`;

  items.forEach(item => {
    const displayName = item.name.replace("\n", " ");
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="ci-img">
        <img src="${item.img}" alt="${displayName}" onerror="this.style.display='none'"/>
      </div>
      <div class="ci-info">
        <div class="ci-name">${displayName}</div>
        <div class="ci-price">$${item.price * item.qty}</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <i class="fa-solid fa-xmark ci-remove" onclick="removeFromCart(${item.id})"></i>`;
    body.insertBefore(div, foot);
  });
}

function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("open");
}

// ════════════════════════════════════════════════════════════
//  ADD / EDIT MODAL
// ════════════════════════════════════════════════════════════
function openAddModal() {
  editTargetId = null;
  document.getElementById("modalTitle").textContent = "Add New Wine";
  document.getElementById("modalSave").innerHTML = '<i class="fa-solid fa-plus"></i> Add Wine';

  // Clear fields
  document.getElementById("fName").value  = "";
  document.getElementById("fPrice").value = "";
  document.getElementById("fCat").value   = "";
  document.getElementById("fDesc").value  = "";
  document.getElementById("fImg").value   = "";
  document.getElementById("modalError").style.display = "none";

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function openEditModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  editTargetId = id;
  document.getElementById("modalTitle").textContent = "Edit Wine";
  document.getElementById("modalSave").innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';

  // Fill fields
  document.getElementById("fName").value  = p.name.replace("\n", " ");
  document.getElementById("fPrice").value = p.price;
  document.getElementById("fCat").value   = p.cat;
  document.getElementById("fDesc").value  = p.desc;
  document.getElementById("fImg").value   = p.img;
  document.getElementById("modalError").style.display = "none";

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  editTargetId = null;
}

function handleModalBg(e) {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
}

function saveProduct() {
  const name  = document.getElementById("fName").value.trim();
  const price = parseFloat(document.getElementById("fPrice").value);
  const cat   = document.getElementById("fCat").value.trim();
  const desc  = document.getElementById("fDesc").value.trim();
  const img   = document.getElementById("fImg").value.trim() || "Images/img5.png";

  // Validation
  if (!name)            return showModalError("Wine ka naam daalein");
  if (!price || price <= 0) return showModalError("Sahi price daalein");
  if (!cat)             return showModalError("Category daalein");
  if (!desc)            return showModalError("Description daalein");

  if (editTargetId !== null) {
    // ── EDIT MODE
    const idx = products.findIndex(x => x.id === editTargetId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, price, cat, desc, img };

      // Cart mein bhi update karo agar exist karta hai
      if (cart[editTargetId]) {
        cart[editTargetId] = { ...products[idx], qty: cart[editTargetId].qty };
        renderCart();
      }
      showToast("✅ Wine update ho gayi!", "success");
    }
  } else {
    // ── ADD MODE
    products.push({ id: nextId++, name, price, cat, desc, img });
    showToast("✅ Naya wine add ho gaya!", "success");
  }

  renderProducts();
  closeModal();
}

function showModalError(msg) {
  const el = document.getElementById("modalError");
  el.textContent   = "⚠️ " + msg;
  el.style.display = "block";
}

// ════════════════════════════════════════════════════════════
//  DELETE MODAL
// ════════════════════════════════════════════════════════════
function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById("deleteOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDeleteModal() {
  document.getElementById("deleteOverlay").classList.remove("open");
  document.body.style.overflow = "";
  deleteTargetId = null;
}

function handleDeleteBg(e) {
  if (e.target === document.getElementById("deleteOverlay")) closeDeleteModal();
}

function confirmDelete() {
  if (deleteTargetId === null) return;

  const p = products.find(x => x.id === deleteTargetId);
  products = products.filter(x => x.id !== deleteTargetId);

  // Cart se bhi hatao
  if (cart[deleteTargetId]) {
    delete cart[deleteTargetId];
    renderCart();
  }

  renderProducts();
  closeDeleteModal();
  showToast(`🗑️ ${p ? p.name.replace("\n"," ") : "Wine"} delete ho gayi`, "danger");
}

// ════════════════════════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════════════════════════
function showToast(msg, type = "info") {
  const wrap = document.getElementById("toastWrap");
  const div  = document.createElement("div");
  div.className   = `toast ${type}`;
  div.textContent = msg;
  wrap.appendChild(div);
  setTimeout(() => {
    div.style.opacity   = "0";
    div.style.transform = "translateY(10px)";
    div.style.transition = "all 0.4s";
  }, 2600);
  setTimeout(() => div.remove(), 3100);
}

// ════════════════════════════════════════════════════════════
//  NAVBAR SCROLL EFFECT
// ════════════════════════════════════════════════════════════
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 30) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// ════════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUT — ESC closes modals/cart
// ════════════════════════════════════════════════════════════
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    closeDeleteModal();
    if (document.getElementById("cartPanel").classList.contains("open")) toggleCart();
  }
});

// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════
renderProducts();


const button1 = document.getElementById("btn")

button1.addEventListener("click",function(){
  alert("Your account was successfully logout")
  window.location.href = "login.html"
})
