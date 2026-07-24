import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import { formatRupiah } from "../components/ProductCard";
import Loader from "../components/Loader";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center py-20">Pesanan tidak ditemukan.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 size={72} className="mx-auto text-green-500 mb-4" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-slate-900 mb-2"
      >
        Pembayaran Berhasil!
      </motion.h1>
      <p className="text-slate-500 mb-8">
        Pesanan #{order._id.slice(-8).toUpperCase()} telah dikonfirmasi dan sedang diproses.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6 text-left mb-8"
      >
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">Metode Pembayaran</span>
          <span className="font-medium">
            {order.paymentMethod.replace("_", " ")} - {order.paymentDetails?.provider}
          </span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500">ID Transaksi</span>
          <span className="font-medium">{order.paymentDetails?.transactionId}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
          <span>Total Bayar</span>
          <span className="text-primary-600">{formatRupiah(order.totalAmount)}</span>
        </div>
      </motion.div>

      <Link
        to="/"
        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
      >
        Kembali Belanja
      </Link>
    </div>
  );
};

export default OrderSuccess;
