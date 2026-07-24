// Jalankan dengan: npm run seed
// Script ini akan mengisi database dengan produk sampel + akun admin & customer default
// setiap kali pertama kali dijalankan (aman dijalankan ulang, tidak akan duplikat).

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const User = require("../models/User");

const sampleProducts = [
  {
    name: "Sepatu Sneakers Urban White",
    description: "Sepatu sneakers kasual dengan bahan kanvas premium, nyaman dipakai seharian, cocok untuk gaya urban dan santai.",
    price: 350000,
    category: "Sepatu",
    stock: 50,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"],
    sold: 120,
  },
  {
    name: "Kemeja Flanel Kotak-Kotak",
    description: "Kemeja flanel lengan panjang motif kotak-kotak, bahan tebal dan hangat, cocok untuk cuaca dingin maupun gaya kasual.",
    price: 175000,
    category: "Pakaian Pria",
    stock: 80,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600"],
    sold: 95,
  },
  {
    name: "Tas Ransel Laptop Anti Air",
    description: "Tas ransel dengan kompartemen laptop hingga 15 inch, bahan waterproof, dilengkapi port USB charging.",
    price: 245000,
    category: "Tas",
    stock: 60,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"],
    sold: 210,
  },
  {
    name: "Jam Tangan Analog Minimalis",
    description: "Jam tangan dengan desain minimalis, tali kulit asli, tahan air hingga 30 meter, cocok untuk pria dan wanita.",
    price: 289000,
    category: "Aksesoris",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600"],
    sold: 76,
  },
  {
    name: "Headphone Bluetooth Wireless",
    description: "Headphone wireless dengan noise cancelling, baterai tahan hingga 20 jam, suara jernih dan bass mantap.",
    price: 425000,
    category: "Elektronik",
    stock: 35,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"],
    sold: 150,
  },
  {
    name: "Kaos Polos Cotton Combed 30s",
    description: "Kaos polos bahan cotton combed 30s, adem dan nyaman, tersedia berbagai warna, cocok untuk daily wear.",
    price: 65000,
    category: "Pakaian Pria",
    stock: 200,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"],
    sold: 340,
  },
  {
    name: "Dress Wanita Motif Bunga",
    description: "Dress casual motif bunga, bahan adem dan jatuh, cocok untuk acara santai maupun jalan-jalan.",
    price: 185000,
    category: "Pakaian Wanita",
    stock: 55,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600"],
    sold: 88,
  },
  {
    name: "Power Bank 20000mAh Fast Charging",
    description: "Power bank kapasitas besar dengan fast charging 22.5W, dilengkapi 2 port USB dan 1 port USB-C.",
    price: 219000,
    category: "Elektronik",
    stock: 70,
    images: ["https://images.unsplash.com/photo-1609592806596-4d1b5e5f4b0a?w=600"],
    sold: 175,
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Seed produk hanya jika koleksi masih kosong
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`✅ ${sampleProducts.length} produk sampel berhasil ditambahkan`);
    } else {
      console.log("ℹ️  Produk sudah ada, lewati seeding produk");
    }

    // Seed akun admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@toko.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "Admin Toko",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
      });
      console.log(`✅ Akun admin dibuat -> email: ${adminEmail} | password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
    } else {
      console.log("ℹ️  Akun admin sudah ada, lewati");
    }

    // Seed akun customer contoh
    const customerEmail = "customer@toko.com";
    const customerExists = await User.findOne({ email: customerEmail });
    if (!customerExists) {
      await User.create({
        name: "Customer Contoh",
        email: customerEmail,
        password: "customer123",
        role: "customer",
      });
      console.log(`✅ Akun customer dibuat -> email: ${customerEmail} | password: customer123`);
    } else {
      console.log("ℹ️  Akun customer sudah ada, lewati");
    }

    console.log("🎉 Seeding selesai!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal seeding:", error.message);
    process.exit(1);
  }
};

seed();
