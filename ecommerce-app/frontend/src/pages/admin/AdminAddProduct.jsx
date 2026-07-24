import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { resolveImage } from "../../components/ProductCard";

const AdminAddProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
        });
        setExistingImages(data.images || []);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      files.forEach((file) => formData.append("images", file));

      if (isEdit) {
        await api.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Produk berhasil diperbarui");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Produk berhasil ditambahkan");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="text-slate-500 hover:text-slate-800">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{isEdit ? "Edit Produk" : "Tambah Produk Baru"}</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 space-y-5"
      >
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Nama Produk</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Deskripsi</label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Harga (Rp)</label>
            <input
              name="price"
              type="number"
              required
              min={0}
              value={form.price}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Kategori</label>
            <input
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Stok</label>
            <input
              name="stock"
              type="number"
              required
              min={0}
              value={form.stock}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 mb-1 block">Gambar Produk</label>

          {existingImages.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {existingImages.map((img, i) => (
                <img key={i} src={resolveImage(img)} className="w-16 h-16 rounded-lg object-cover border" />
              ))}
            </div>
          )}

          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-8 cursor-pointer hover:border-primary-400 transition-colors">
            <UploadCloud className="text-slate-400" size={28} />
            <span className="text-sm text-slate-500">Klik untuk upload gambar (bisa lebih dari satu)</span>
            <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
          </label>

          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} className="w-16 h-16 rounded-lg object-cover border" />
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AdminAddProduct;
