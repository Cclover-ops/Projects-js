const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Buat pesanan baru (customer) - dipanggil setelah pembayaran sukses
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Keranjang belanja kosong" });
    }

    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produk ${item.productId} tidak ditemukan` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Stok ${product.name} tidak mencukupi` });
      }

      itemsTotal += product.price * item.qty;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || "",
        price: product.price,
        qty: item.qty,
      });

      product.stock -= item.qty;
      product.sold += item.qty;
      await product.save();
    }

    const shippingFee = 15000;
    const totalAmount = itemsTotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      itemsTotal,
      shippingFee,
      totalAmount,
      status: "paid",
      isPaid: true,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ambil semua pesanan milik user yang login
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ambil detail 1 pesanan
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    // Pastikan hanya pemilik order atau admin yang bisa lihat
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Ambil semua pesanan (admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update status pesanan (admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    order.status = status;
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
