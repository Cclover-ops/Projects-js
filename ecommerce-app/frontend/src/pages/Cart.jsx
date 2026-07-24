import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatRupiah, resolveImage } from "../components/ProductCard";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingFee = cartItems.length > 0 ? 15000 : 0;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <ShoppingBag size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Keranjangmu masih kosong</h2>
          <p className="text-slate-500 mb-6">Yuk mulai belanja dan temukan produk favoritmu!</p>
          <Link to="/" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">
            Mulai Belanja
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Keranjang Belanja</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-soft border border-slate-100"
              >
                <img
                  src={resolveImage(item.image)}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{item.name}</h3>
                  <p className="text-primary-600 font-bold">{formatRupiah(item.price)}</p>
                </div>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    className="p-2 hover:bg-slate-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, Math.min(item.stock, item.qty + 1))}
                    className="p-2 hover:bg-slate-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 h-fit"
        >
          <h3 className="font-semibold text-lg mb-4">Ringkasan Belanja</h3>
          <div className="space-y-2 text-sm text-slate-600 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatRupiah(itemsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(shippingFee)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-slate-900 text-lg border-t pt-4 mb-6">
            <span>Total</span>
            <span>{formatRupiah(itemsTotal + shippingFee)}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleCheckout}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Checkout Sekarang
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
