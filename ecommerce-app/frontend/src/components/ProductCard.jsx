import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { SERVER_URL } from "../api/axios";

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);

const resolveImage = (path) => (path?.startsWith("http") ? path : `${SERVER_URL}${path}`);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-soft border border-slate-100 flex flex-col"
    >
      <Link to={`/product/${product._id}`} className="block overflow-hidden aspect-square bg-slate-100">
        <motion.img
          src={resolveImage(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-primary-600 font-medium mb-1">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-amber-500 text-sm mb-2">
          <Star size={14} fill="currentColor" />
          <span>{product.rating}</span>
          <span className="text-slate-400">· {product.sold} terjual</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-slate-900">{formatRupiah(product.price)}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product, 1)}
            disabled={product.stock === 0}
            className="p-2 rounded-full bg-primary-600 text-white hover:bg-primary-700 disabled:bg-slate-300 transition-colors"
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
export { formatRupiah, resolveImage };
