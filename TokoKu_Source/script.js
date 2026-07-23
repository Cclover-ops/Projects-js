// script.js - Data & Logika Aplikasi TokoKu

// Data Produk Contoh
const products = [
  { id: 1, name: "Sepatu Sneakers Canvas", category: "Fashion", price: 350000, rating: 4.8, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Jam Tangan Minimalis", category: "Aksesoris", price: 850000, rating: 4.9, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Tas Ransel Waterproof", category: "Fashion", price: 420000, rating: 4.7, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Headphone Wireless Over-Ear", category: "Elektronik", price: 1250000, rating: 4.9, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Tumbler Stainless Steel", category: "Gaya Hidup", price: 180000, rating: 4.6, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Keyboard Mekanikal RGB", category: "Elektronik", price: 750000, rating: 4.8, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80" },
  { id: 7, name: "Kacamata Hitam Polarized", category: "Aksesoris", price: 290000, rating: 4.5, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80" },
  { id: 8, name: "Lampu Meja LED Smart", category: "Elektronik", price: 310000, rating: 4.7, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80" }
];

// State Aplikasi
let cart = JSON.parse(localStorage.getItem('tokoku_cart')) || [];
let activeCategory = 'Semua';
let searchQuery = '';

// Elemen DOM
const productGrid = document.getElementById('productGrid');
const categoryContainer = document.getElementById('categoryContainer');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const cartBtn = document.getElementById('cartBtn');
const cartCountBadge = document.getElementById('cartCountBadge');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const checkoutSummary = document.getElementById('checkoutSummary');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

// Helper Format Rupiah
const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

// Simpan Keranjang ke LocalStorage
function saveCart() {
  localStorage.setItem('tokoku_cart', JSON.stringify(cart));
  updateCartBadge();
}

// Render Kategori
function renderCategories() {
  const categories = ['Semua', ...new Set(products.map(p => p.category))];
  categoryContainer.innerHTML = categories.map(cat => `
    <button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
      activeCategory === cat 
        ? 'bg-indigo-600 text-white shadow-sm' 
        : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
    }">
      ${cat}
    </button>
  `).join('');
}

// Ubah Kategori Aktif
window.setCategory = function(cat) {
  activeCategory = cat;
  renderCategories();
  filterProducts();
};

// Render Produk ke Grid
function renderProducts(items) {
  if (items.length === 0) {
    productGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  productGrid.classList.remove('hidden');
  emptyState.classList.add('hidden');

  productGrid.innerHTML = items.map(product => `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div class="h-48 overflow-hidden relative bg-gray-100">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
        <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700">
          ${product.category}
        </span>
      </div>
      <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div class="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
            <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
            <span>${product.rating}</span>
          </div>
          <h3 class="font-bold text-gray-800 text-base line-clamp-1">${product.name}</h3>
          <p class="text-indigo-600 font-extrabold text-lg mt-1">${formatIDR(product.price)}</p>
        </div>
        <button onclick="addToCart(${product.id})" class="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 border border-indigo-200">
          <i data-lucide="shopping-cart" class="w-4 h-4"></i>
          <span>+ Keranjang</span>
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Filter Produk berdasarkan Kategori & Kata Kunci Search
function filterProducts() {
  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  renderProducts(filtered);
}

// Event Listener Input Pencarian
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  filterProducts();
});

// Tambah ke Keranjang
window.addToCart = function(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
  openCart();
};

// Ubah Jumlah Item di Keranjang
window.updateQty = function(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  renderCart();
};

// Hapus Item dari Keranjang
window.removeFromCart = function(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
};

// Perbarui Badge Jumlah di Navbar
function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (totalCount > 0) {
    cartCountBadge.textContent = totalCount;
    cartCountBadge.classList.remove('hidden');
  } else {
    cartCountBadge.classList.add('hidden');
  }
}

// Render Tampilan Keranjang
function renderCart() {
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-12 text-gray-500">
        <i data-lucide="shopping-bag" class="w-12 h-12 mx-auto text-gray-300 mb-2"></i>
        <p class="text-sm">Keranjang Anda masih kosong.</p>
      </div>
    `;
    cartTotal.textContent = 'Rp 0';
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    lucide.createIcons();
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

  cartItemsContainer.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-md">
      <div class="flex-1 min-w-0">
        <h4 class="text-sm font-semibold text-gray-800 truncate">${item.name}</h4>
        <p class="text-xs text-indigo-600 font-bold mt-0.5">${formatIDR(item.price)}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="updateQty(${item.id}, -1)" class="w-6 h-6 rounded bg-white border border-gray-300 flex items-center justify-center text-xs font-bold hover:bg-gray-100">-</button>
          <span class="text-xs font-medium w-4 text-center">${item.qty}</span>
          <button onclick="updateQty(${item.id}, 1)" class="w-6 h-6 rounded bg-white border border-gray-300 flex items-center justify-center text-xs font-bold hover:bg-gray-100">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 p-1">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = formatIDR(total);
  lucide.createIcons();
}

// Toggle Drawer Keranjang
function openCart() { cartDrawer.classList.remove('hidden'); }
function closeCart() { cartDrawer.classList.add('hidden'); }

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Buka Modal Checkout
checkoutBtn.addEventListener('click', () => {
  closeCart();
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  checkoutSummary.innerHTML = `
    <p class="font-bold text-gray-700">Item Pesanan (${cart.length} produk):</p>
    <ul class="list-disc pl-4 space-y-1 text-gray-600">
      ${cart.map(i => `<li>${i.name} x${i.qty} - <b>${formatIDR(i.price * i.qty)}</b></li>`).join('')}
    </ul>
    <div class="border-t pt-2 mt-2 font-bold text-indigo-600 flex justify-between">
      <span>Total Tagihan:</span>
      <span>${formatIDR(total)}</span>
    </div>
  `;
  checkoutModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));

// Konfirmasi Pesanan (Simulasi)
confirmOrderBtn.addEventListener('click', () => {
  const name = document.getElementById('custName').value.trim();
  const addr = document.getElementById('custAddr').value.trim();

  if (!name || !addr) {
    alert('Mohon isi Nama dan Alamat Pengiriman secara lengkap.');
    return;
  }

  alert(`Pesanan Berhasil!\n\nTerima kasih, ${name}.\nAlamat Kirim: ${addr}\n\n(Ini adalah simulasi client-side tanpa backend).`);
  
  // Kosongkan Keranjang setelah sukses
  cart = [];
  saveCart();
  renderCart();
  checkoutModal.classList.add('hidden');
});

// Inisialisasi Aplikasi saat Load
renderCategories();
filterProducts();
renderCart();
updateCartBadge();
