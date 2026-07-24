const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Ambil statistik untuk admin dashboard
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Total pendapatan bulan ini (dari order yang sudah dibayar)
    const revenueThisMonthAgg = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const revenueThisMonth = revenueThisMonthAgg[0]?.total || 0;

    // Total pendapatan bulan lalu (untuk hitung persentase pertumbuhan)
    const revenueLastMonthAgg = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const revenueLastMonth = revenueLastMonthAgg[0]?.total || 0;

    const growthPercent =
      revenueLastMonth > 0
        ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)
        : revenueThisMonth > 0
        ? 100
        : 0;

    // Data grafik penjualan 14 hari terakhir
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const salesChartAgg = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Isi tanggal yang kosong dengan 0 agar grafik tetap kontinu
    const salesChart = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      const found = salesChartAgg.find((x) => x._id === key);
      salesChart.push({
        date: key,
        total: found ? found.total : 0,
        orders: found ? found.orders : 0,
      });
    }

    // Jumlah user baru bulan ini
    const newUsersThisMonth = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: startOfMonth },
    });

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const pendingOrders = await Order.countDocuments({ status: { $in: ["pending", "paid", "processing"] } });

    res.json({
      revenueThisMonth,
      revenueLastMonth,
      growthPercent,
      newUsersThisMonth,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      salesChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
