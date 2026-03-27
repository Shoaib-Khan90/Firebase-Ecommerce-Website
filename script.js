
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  // 🔴 APNA FIREBASE CONFIG YAHAN PASTE KAREIN:
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Auth state observer — user login/logout detect karta hai
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showLoggedIn(user);
    } else {
      showLoggedOut();
    }
  });

  // ── REGISTER ──
  window.firebaseRegister = async function(name, email, password) {
    try {
      showAuthLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      closeAuthModal();
      showToast("✅ Account ban gaya! Welcome " + name, "success");
    } catch (e) {
      showAuthError(getFirebaseError(e.code));
    } finally {
      showAuthLoading(false);
    }
  };

  // ── LOGIN ──
  window.firebaseLogin = async function(email, password) {
    try {
      showAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      closeAuthModal();
      showToast("✅ Login ho gaye!", "success");
    } catch (e) {
      showAuthError(getFirebaseError(e.code));
    } finally {
      showAuthLoading(false);
    }
  };

  // ── GOOGLE LOGIN ──
  window.firebaseGoogleLogin = async function() {
    try {
      showAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      closeAuthModal();
      showToast("✅ Google se login ho gaye!", "success");
    } catch (e) {
      showAuthError(getFirebaseError(e.code));
    } finally {
      showAuthLoading(false);
    }
  };

  // ── LOGOUT ──
  window.firebaseLogout = async function() {
    await signOut(auth);
    showToast("👋 Logout ho gaye!", "info");
  };

  function getFirebaseError(code) {
    const errors = {
      "auth/email-already-in-use": "Yeh email pehle se registered hai",
      "auth/invalid-email": "Email sahi nahi hai",
      "auth/weak-password": "Password kam se kam 6 characters ka hona chahiye",
      "auth/user-not-found": "Yeh email registered nahi hai",
      "auth/wrong-password": "Password galat hai",
      "auth/invalid-credential": "Email ya password galat hai",
      "auth/too-many-requests": "Bohot zyada try kiya. Thodi der baad try karein",
      "auth/network-request-failed": "Internet connection check karein",
    };
    return errors[code] || "Kuch masla aa gaya. Dobara try karein";
  }

  const products = [
  { id:1, name:"Pro Wireless Headphones", cat:"Electronics", price:8499, old:11999, emoji:"🎧", badge:"HOT", rating:4.8, reviews:234 },
  { id:2, name:"Smart Watch Ultra", cat:"Electronics", price:24999, old:34999, emoji:"⌚", badge:"NEW", rating:4.9, reviews:187 },
  { id:3, name:"Premium Leather Jacket", cat:"Fashion", price:12999, old:18999, emoji:"🧥", badge:"SALE", rating:4.7, reviews:156 },
  { id:4, name:"Running Shoes Pro", cat:"Sports", price:6499, old:8999, emoji:"👟", badge:"", rating:4.6, reviews:298 },
  { id:5, name:"Luxury Perfume Set", cat:"Beauty", price:4999, old:6999, emoji:"🌸", badge:"HOT", rating:4.9, reviews:412 },
  { id:6, name:"Minimalist Desk Lamp", cat:"Home", price:3499, old:4999, emoji:"💡", badge:"NEW", rating:4.5, reviews:89 },
  { id:7, name:"Silk Evening Dress", cat:"Fashion", price:9999, old:14999, emoji:"👗", badge:"SALE", rating:4.8, reviews:201 },
  { id:8, name:"Bluetooth Speaker", cat:"Electronics", price:5499, old:7999, emoji:"🔊", badge:"", rating:4.7, reviews:321 },
  { id:9, name:"Yoga Mat Premium", cat:"Sports", price:2999, old:3999, emoji:"🧘", badge:"NEW", rating:4.6, reviews:143 },
  { id:10, name:"Scented Candle Set", cat:"Home", price:1999, old:2999, emoji:"🕯️", badge:"", rating:4.8, reviews:267 },
  { id:11, name:"Men's Sunglasses", cat:"Fashion", price:3999, old:5999, emoji:"🕶️", badge:"HOT", rating:4.7, reviews:178 },
  { id:12, name:"Face Serum Gold", cat:"Beauty", price:3499, old:4499, emoji:"✨", badge:"SALE", rating:4.9, reviews:534 },
];

let cart = {};
let activeFilter = 'All';
let wishlist = new Set();

// ── RENDER PRODUCTS ──
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  if (!list.length) {
    grid.innerHTML = `<div style="color:var(--muted);padding:40px;grid-column:1/-1;text-align:center;font-size:15px;">Koi product nahi mila 😕</div>`;
    return;
  }
  list.forEach((p, i) => {
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating%1 ? '½' : '');
    const inCart = cart[p.id] ? cart[p.id].qty : 0;
    const wished = wishlist.has(p.id);
    grid.innerHTML += `
      <div class="p-card" style="animation-delay:${i*0.06}s" id="card-${p.id}">
        <div class="p-img">
          ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ''}
          <div class="p-wish ${wished?'loved':''}" onclick="toggleWish(${p.id},event)" id="wish-${p.id}">${wished?'❤️':'🤍'}</div>
          ${p.emoji}
        </div>
        <div class="p-body">
          <div class="p-cat">${p.cat}</div>
          <div class="p-name">${p.name}</div>
          <div class="p-rating">
            <span class="p-stars">${stars}</span>
            <span class="p-rev">(${p.reviews})</span>
          </div>
          <div class="p-foot">
            <div>
              <span class="p-price">PKR ${p.price.toLocaleString()}</span>
              ${p.old ? `<span class="p-old">PKR ${p.old.toLocaleString()}</span>` : ''}
            </div>
            <button class="btn-add" onclick="addToCart(${p.id}, event)">+</button>
          </div>
        </div>
      </div>`;
  });
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  let list = products;
  if (activeFilter !== 'All') list = list.filter(p => p.cat === activeFilter);
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
  renderProducts(list);
}

function setFilter(cat, el) {
  activeFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  filterProducts();
}

// ── WISHLIST ──
function toggleWish(id, e) {
  e.stopPropagation();
  const btn = document.getElementById('wish-'+id);
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.textContent = '🤍';
    btn.classList.remove('loved');
    showToast('Wishlist se hata diya', 'info');
  } else {
    wishlist.add(id);
    btn.textContent = '❤️';
    btn.classList.add('loved');
    showToast('❤️ Wishlist mein add ho gaya!', 'success');
  }
}

// ── CART ──
function addToCart(id, e) {
  if (e) e.stopPropagation();
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (cart[id]) cart[id].qty++;
  else cart[id] = { ...p, qty: 1 };
  updateCartUI();
  showToast(`🛒 ${p.name} cart mein add!`, 'success');
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const items = Object.values(cart);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  // Badge
  const badge = document.getElementById('cartCount');
  badge.style.display = count ? 'flex' : 'none';
  badge.textContent = count;

  // Body
  const body = document.getElementById('cartBody');
  const empty = document.getElementById('cartEmpty');
  const foot = document.getElementById('cartFoot');

  if (!items.length) {
    empty.style.display = 'block';
    foot.style.display = 'none';
    // Remove all item divs
    body.querySelectorAll('.cart-item').forEach(el => el.remove());
    return;
  }

  empty.style.display = 'none';
  foot.style.display = 'block';
  document.getElementById('cartSubtotal').textContent = `PKR ${total.toLocaleString()}`;
  document.getElementById('cartTotal').textContent = `PKR ${total.toLocaleString()}`;

  // Re-render items
  body.querySelectorAll('.cart-item').forEach(el => el.remove());
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.id = 'ci-' + item.id;
    div.innerHTML = `
      <div class="ci-img">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">PKR ${(item.price * item.qty).toLocaleString()}</div>
        <div class="ci-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <span class="ci-del" onclick="removeFromCart(${item.id})">✕</span>`;
    body.insertBefore(div, foot);
  });
}

function toggleCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  panel.classList.toggle('open');
  overlay.classList.toggle('open');
}

function checkout() {
  const user = window._currentUser;
  if (!user) {
    toggleCart();
    openAuth('login');
    showToast('Pehle login karein checkout ke liye', 'info');
    return;
  }
  showToast('🚀 Checkout processing... (coming soon!)', 'success');
}

// ── AUTH MODAL ──
window._currentUser = null;

function openAuth(tab) {
  document.getElementById('authModal').classList.add('open');
  document.getElementById('authError').style.display = 'none';
  document.getElementById('authError').textContent = '';
  switchTab(tab || 'login');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay click
document.getElementById('authModal').addEventListener('click', function(e) {
  if (e.target === this) closeAuthModal();
});

function switchTab(tab) {
  const loginF = document.getElementById('loginForm');
  const regF   = document.getElementById('registerForm');
  const tabL   = document.getElementById('tabLogin');
  const tabR   = document.getElementById('tabRegister');
  document.getElementById('authError').style.display = 'none';

  if (tab === 'login') {
    loginF.style.display = 'block'; regF.style.display = 'none';
    tabL.classList.add('on'); tabR.classList.remove('on');
  } else {
    loginF.style.display = 'none'; regF.style.display = 'block';
    tabL.classList.remove('on'); tabR.classList.add('on');
  }
}

function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  if (!email || !pass) { showAuthError('Email aur password daalein'); return; }
  firebaseLogin(email, pass);
}

function doRegister() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass  = document.getElementById('regPass').value;
  if (!name)  { showAuthError('Apna naam daalein'); return; }
  if (!email) { showAuthError('Email daalein'); return; }
  if (!pass)  { showAuthError('Password daalein'); return; }
  if (pass.length < 6) { showAuthError('Password kam se kam 6 characters ka hona chahiye'); return; }
  firebaseRegister(name, email, pass);
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  el.textContent = '⚠️ ' + msg;
  el.style.display = 'block';
}

function showAuthLoading(loading) {
  const btnL = document.getElementById('loginSubmit');
  const btnR = document.getElementById('regSubmit');
  if (loading) {
    btnL.innerHTML = '<span class="spinner"></span>';
    btnR.innerHTML = '<span class="spinner"></span>';
    btnL.disabled = btnR.disabled = true;
  } else {
    btnL.innerHTML = 'Sign In';
    btnR.innerHTML = 'Create Account';
    btnL.disabled = btnR.disabled = false;
  }
}

// ── AUTH STATE HANDLERS ──
function showLoggedIn(user) {
  window._currentUser = user;
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('userWrap').style.display = 'block';
  const av = document.getElementById('userAvatar');
  av.style.display = 'flex';
  const initials = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
  av.textContent = initials;
  document.getElementById('dropName').textContent = user.displayName || user.email;
}

function showLoggedOut() {
  window._currentUser = null;
  document.getElementById('loginBtn').style.display = 'flex';
  document.getElementById('userWrap').style.display = 'none';
  document.getElementById('userAvatar').style.display = 'none';
}

function toggleDropdown() {
  document.getElementById('userDropdown').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const wrap = document.getElementById('userWrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('userDropdown').classList.remove('open');
  }
});

// ── TOAST ──
function showToast(msg, type='info') {
  const wrap = document.getElementById('toastWrap');
  const div = document.createElement('div');
  div.className = `toast ${type}`;
  div.textContent = msg;
  wrap.appendChild(div);
  setTimeout(() => div.style.opacity = '0', 2500);
  setTimeout(() => div.remove(), 2900);
}

// ── INIT ──
renderProducts(products);