import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import { formatRupiah, resolveImage } from "../../components/ProductCard";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/products")
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus produk "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Produk berhasil dihapus");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus produk");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin" className="text-slate-500 hover:text-slate-800">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Produk</h1>
        </div>
        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700"
        >
          <Plus size={16} /> Tambah Produk
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="p-4">Produk</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Stok</th>
                  <th className="p-4">Terjual</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((p) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-t border-slate-100"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={resolveImage(p.images[0])}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                        <span className="font-medium text-slate-800 line-clamp-1">{p.name}</span>
                      </td>
                      <td className="p-4 text-slate-500">{p.category}</td>
                      <td className="p-4 font-medium">{formatRupiah(p.price)}</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4">{p.sold}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-600"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
