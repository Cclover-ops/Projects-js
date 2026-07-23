# 🛍️ TokoKu - E-Commerce Client-Side Prototype

TokoKu adalah prototipe aplikasi *e-commerce* berbasis web modern dan responsif yang berjalan sepenuhnya di sisi *client* (*sans backend*). Aplikasi ini dilengkapi dengan berbagai fitur interaktif seperti pencarian produk, filter kategori, keranjang belanja interaktif dengan *local storage*, serta simulasi *checkout*.

---

## ✨ Fitur Utama

- **🔍 Pencarian & Filter Produk**: Cari produk berdasarkan kata kunci secara *real-time* atau filter berdasarkan kategori (Fashion, Aksesoris, Elektronik, Gaya Hidup).
- **🛒 Keranjang Belanja Interaktif**:
  - Tambah, hapus, dan atur jumlah (*quantity*) produk dalam keranjang.
  - Tampilan keranjang berbentuk *slide-over drawer* (sidebar).
  - Perhitungan otomatis subtotal harga dalam format Rupiah (IDR).
- **💾 Penyimpanan Lokal (LocalStorage)**: Data keranjang belanja disimpan secara otomatis di *browser*, sehingga item tidak hilang saat halaman diperbarui (*refresh*).
- **💳 Simulasi Checkout Modal**: Modal konfirmasi pesanan interaktif dengan ringkasan item dan total biaya.
- **📱 Responsif & Modern**: Tampilan dioptimalkan untuk perangkat *mobile*, tablet, hingga *desktop*.

---

## 📁 Struktur File

```text
.
├── index.html   # Struktur HTML & UI utama aplikasi
├── style.css    # Style kustom CSS (Scrollbar, dll.)
└── script.js    # Logika interaktif, state management, & data produk
```

---

## 🚀 Cara Menjalankan

Aplikasi ini tidak memerlukan instalasi *server* atau *dependency* Node.js / Backend.

1. **Clone atau Unduh Repository**:
   ```bash
   git clone https://github.com/username/tokoku.git
   ```
2. **Buka File**:
   Buka file `index.html` langsung di *browser* favorit Anda (Chrome, Firefox, Edge, Safari).
   
   *Atau gunakan ekstensi **Live Server** di VS Code untuk pengalaman pengembangan yang lebih baik.*

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Struktur semantic web.
- **Tailwind CSS (via CDN)**: Framework CSS untuk penataan gaya responsif berbasis *utility classes*.
- **JavaScript (Vanilla ES6+)**: Logika aplikasi, pengelolaan keranjang, manipulasi DOM, dan LocalStorage.
- **Lucide Icons**: Library ikon modern dan ringan.

---

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan prototipe. Bebas digunakan dan dikembangkan kembali.
