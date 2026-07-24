import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      const redirect = searchParams.get("redirect");
      if (redirect) navigate(redirect);
      else if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch {
      // error sudah ditampilkan via toast
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-soft border border-slate-100"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <LogIn size={26} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Masuk ke Akunmu</h1>
          <p className="text-slate-500 text-sm mt-1">Selamat datang kembali di TokoKita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Daftar sekarang
          </Link>
        </p>

        <div className="mt-6 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
          <p className="font-medium text-slate-600">Akun percobaan:</p>
          <p>Admin: admin@toko.com / admin123</p>
          <p>Customer: customer@toko.com / customer123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
