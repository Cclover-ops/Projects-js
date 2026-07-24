const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">TokoKita</h3>
          <p className="text-sm text-slate-400">
            Belanja online mudah, aman, dan terpercaya dengan berbagai pilihan metode pembayaran.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Metode Pembayaran</h4>
          <p className="text-sm text-slate-400">Transfer Bank · Kartu Kredit · E-Wallet</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Kontak</h4>
          <p className="text-sm text-slate-400">support@tokokita.com</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 border-t border-slate-800 py-4">
        © {new Date().getFullYear()} TokoKita. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
};

export default Footer;
