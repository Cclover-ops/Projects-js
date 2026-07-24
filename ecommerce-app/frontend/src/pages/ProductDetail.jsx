import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingCart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { formatRupiah, resolveImage } from "../components/ProductCard";
import Loader from "../components/Loader";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-20">Produk tidak ditemukan.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
            <motion.img
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={resolveImage(product.images[activeImg])}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    activeImg === idx ? "border-primary-600" : "border-transparent"
                  }`}
                >
                  <img src={resolveImage(img)} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span className="text-sm text-primary-600 font-medium">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1 mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 text-amber-500 mb-4">
            <Star size={18} fill="currentColor" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-slate-400 text-sm">· {product.sold} terjual · Stok {product.stock}</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mb-6">{formatRupiah(product.price)}</p>
          <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-600">Jumlah:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-slate-100">
                <Minus size={16} />
              </button>
              <span className="px-4 font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-2 hover:bg-slate-100"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={product.stock === 0}
              onClick={() => addToCart(product, qty)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              <ShoppingCart size={18} /> Tambah ke Keranjang
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={product.stock === 0}
              onClick={() => {
                addToCart(product, qty);
                navigate("/cart");
              }}
              className="flex-1 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              Beli Sekarang
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
