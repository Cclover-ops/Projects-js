const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama produk wajib diisi"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Deskripsi produk wajib diisi"],
    },
    price: {
      type: Number,
      required: [true, "Harga produk wajib diisi"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Kategori wajib diisi"],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String, // path atau URL gambar
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
