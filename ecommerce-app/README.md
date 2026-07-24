# 🛍️ TokoKita - Aplikasi E-Commerce (MERN Stack)

Aplikasi e-commerce full-stack menggunakan **MongoDB, Express, React, Node.js** dengan fitur:

- ✅ Dashboard Admin (kelola produk + upload gambar, kelola pesanan, total pendapatan bulan ini, grafik penjualan, jumlah user baru)
- ✅ Pembayaran simulasi: Transfer Bank (BCA, Mandiri, BNI, BRI, CIMB Niaga), Kartu Kredit (Visa/Mastercard/JCB), E-Wallet (GoPay, OVO, DANA, ShopeePay, LinkAja)
- ✅ Autentikasi Email & Password dengan JWT (role: `customer` & `admin`)
- ✅ Keranjang belanja untuk customer
- ✅ Styling dengan Tailwind CSS + animasi Framer Motion di semua halaman
- ✅ Struktur folder rapi & terpisah antara backend dan frontend
- ✅ Data produk sampel otomatis saat pertama kali dijalankan (seeding)

---

## 📁 Struktur Folder

```
ecommerce-app/
├── backend/
│   ├── config/db.js              # Koneksi MongoDB
│   ├── models/                   # User, Product, Order
│   ├── middleware/                # auth (JWT), upload (multer)
│   ├── controllers/               # Logic bisnis tiap fitur
│   ├── routes/                    # Endpoint API
│   ├── seed/seedData.js           # Data produk & akun sampel
│   ├── uploads/                   # Folder gambar produk yang diupload
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/axios.js           # Instance axios + interceptor JWT
    │   ├── context/               # AuthContext, CartContext
    │   ├── components/            # Navbar, Footer, ProductCard, dll
    │   ├── pages/                 # Home, Cart, Checkout, Login, dll
    │   └── pages/admin/           # Dashboard, Products, Orders admin
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Cara Menjalankan (Instalasi Lokal)

### Prasyarat
Pastikan sudah terinstall di komputermu:
1. **Node.js** (v18 ke atas) — [download di sini](https://nodejs.org)
2. **MongoDB** — bisa pakai:
   - MongoDB lokal ([download Community Server](https://www.mongodb.com/try/download/community)), atau
   - **MongoDB Atlas** (gratis, cloud) — [buat cluster di sini](https://www.mongodb.com/cloud/atlas/register) lalu ambil connection string-nya

### 1️⃣ Setup Backend

```bash
cd backend
npm install
```

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Buka `.env` dan sesuaikan (minimal `MONGO_URI` dan `JWT_SECRET`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
PORT=5000
JWT_SECRET=ganti_dengan_string_acak_yang_panjang
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@toko.com
ADMIN_PASSWORD=admin123
```

> 💡 Jika pakai MongoDB Atlas, `MONGO_URI` akan terlihat seperti:
> `mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db`

Jalankan seeding untuk mengisi database dengan **8 produk sampel** + **akun admin & customer**:

```bash
npm run seed
```

Setelah seeding, jalankan server backend:

```bash
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 2️⃣ Setup Frontend

Buka terminal baru:

```bash
cd frontend
npm install
```

Salin `.env.example` menjadi `.env` (biasanya tidak perlu diubah jika backend di port 5000):

```bash
cp .env.example .env
```

Jalankan frontend:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 3️⃣ Buka Aplikasi

Kunjungi `http://localhost:5173` di browser.

---

## 🔑 Akun Percobaan (dibuat otomatis saat seeding)

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Admin    | admin@toko.com       | admin123    |
| Customer | customer@toko.com    | customer123 |

Login sebagai **admin** untuk mengakses Dashboard Admin (`/admin`), atau sebagai **customer**/daftar akun baru untuk belanja.

---

## 💳 Tentang Sistem Pembayaran

Sistem pembayaran pada aplikasi ini adalah **simulasi** (mock) — cocok untuk demo, portofolio, atau development. Setiap transaksi akan otomatis "berhasil" dan menghasilkan ID transaksi.

Untuk **produksi nyata**, ganti logic di `backend/controllers/paymentController.js` dengan integrasi payment gateway sungguhan, misalnya:
- **Midtrans** (populer di Indonesia, support VA bank, kartu kredit, e-wallet)
- **Xendit**
- **Stripe** (untuk pasar internasional)

Umumnya kamu hanya perlu mendaftar akun di gateway tersebut, dapatkan API key, lalu panggil API mereka di dalam `processPayment`.

---

## 🛠️ Fitur Dashboard Admin

Setelah login sebagai admin, buka `/admin` untuk melihat:
- **Total pendapatan bulan ini** (dengan persentase pertumbuhan dibanding bulan lalu)
- **Grafik penjualan** 14 hari terakhir (area chart interaktif)
- **Jumlah user baru** bulan ini
- **Total produk** & **total pesanan**

Dari dashboard, admin bisa masuk ke:
- **Kelola Produk** (`/admin/products`) — tambah, edit, hapus produk + upload gambar
- **Kelola Pesanan** (`/admin/orders`) — lihat semua pesanan customer & update status (pending → paid → processing → shipped → completed)

---

## 📦 Build untuk Produksi

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```
Hasil build ada di folder `frontend/dist`, siap di-deploy ke hosting seperti Vercel, Netlify, atau server sendiri (Nginx dll). Backend bisa di-deploy ke Railway, Render, atau VPS.

Jangan lupa update `VITE_API_URL` (frontend `.env`) dan `CLIENT_URL` (backend `.env`) sesuai domain production kamu.

---

## 🧩 Tech Stack

| Layer     | Teknologi                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router |
| Backend   | Node.js, Express, JWT, Bcrypt, Multer            |
| Database  | MongoDB (Mongoose ODM)                           |

---

Selamat mencoba! 🎉 Jika ada error saat instalasi, cek kembali apakah MongoDB sudah berjalan dan `.env` sudah diisi dengan benar.
