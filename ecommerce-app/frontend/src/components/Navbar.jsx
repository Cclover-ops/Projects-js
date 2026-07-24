import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalQty } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-primary-700">
          <Store size={24} />
          TokoKita
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">
            Beranda
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-slate-600 hover:text-primary-600 transition-colors font-medium"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-slate-700 hover:text-primary-600 transition-colors">
            <ShoppingCart size={22} />
            <AnimatePresence>
              {totalQty > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {totalQty}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 flex items-center gap-1">
                <User size={16} /> {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Beranda
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                Keranjang ({totalQty})
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  Dashboard Admin
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout} className="text-left text-red-600">
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  Masuk
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
