import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Wallet, ShoppingBag, Users, Package, TrendingUp, TrendingDown, LayoutGrid, ListOrdered } from "lucide-react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import { formatRupiah } from "../../components/ProductCard";

const StatCard = ({ icon: Icon, label, value, sub, subPositive, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
        <Icon size={20} />
      </div>
      {sub && (
        <span
          className={`flex items-center gap-1 text-xs font-medium ${
            subPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {subPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {sub}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (!stats) return null;

  const chartData = stats.salesChart.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <div className="flex gap-2">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            <LayoutGrid size={16} /> Kelola Produk
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            <ListOrdered size={16} /> Kelola Pesanan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Wallet}
          label="Total Pendapatan Bulan Ini"
          value={formatRupiah(stats.revenueThisMonth)}
          sub={`${stats.growthPercent > 0 ? "+" : ""}${stats.growthPercent}% dari bulan lalu`}
          subPositive={stats.growthPercent >= 0}
          delay={0}
        />
        <StatCard icon={ShoppingBag} label="Total Pesanan" value={stats.totalOrders} delay={0.05} />
        <StatCard icon={Users} label="User Baru Bulan Ini" value={stats.newUsersThisMonth} delay={0.1} />
        <StatCard icon={Package} label="Total Produk" value={stats.totalProducts} delay={0.15} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100"
      >
        <h3 className="font-semibold text-lg mb-1">Grafik Penjualan</h3>
        <p className="text-sm text-slate-500 mb-6">Total pendapatan 14 hari terakhir</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) => formatRupiah(value)}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
