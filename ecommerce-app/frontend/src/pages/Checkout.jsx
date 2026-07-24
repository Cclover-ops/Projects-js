import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../components/ProductCard";

const paymentTabs = [
  { id: "bank_transfer", label: "Transfer Bank", icon: Landmark },
  { id: "credit_card", label: "Kartu Kredit", icon: CreditCard },
  { id: "e_wallet", label: "E-Wallet", icon: Wallet },
];

const Checkout = () => {
  const { cartItems, itemsTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [methods, setMethods] = useState({ bank_transfer: [], credit_card: [], e_wallet: [] });
  const [activeMethod, setActiveMethod] = useState("bank_transfer");
  const [provider, setProvider] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const shippingFee = 15000;
  const total = itemsTotal + shippingFee;

  useEffect(() => {
    if (cartItems.length === 0) navigate("/cart");
    api.get("/payment/methods").then(({ data }) => {
      setMethods(data);
      setProvider(data.bank_transfer[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeMethod !== "credit_card") {
      setProvider(methods[activeMethod]?.[0] || "");
    }
  }, [activeMethod, methods]);

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const validateShipping = () => {
    return Object.values(shipping).every((v) => v.trim() !== "");
  };

  const handlePayNow = async () => {
    if (!validateShipping()) {
      toast.error("Lengkapi data pengiriman terlebih dahulu");
      return;
    }
    if (activeMethod === "credit_card" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      toast.error("Lengkapi data kartu kredit terlebih dahulu");
      return;
    }
    if ((activeMethod === "bank_transfer" || activeMethod === "e_wallet") && !provider) {
      toast.error("Pilih penyedia pembayaran");
      return;
    }

    setProcessing(true);
    try {
      // 1. Proses pembayaran (simulasi)
      const { data: paymentResult } = await api.post("/payment/process", {
        method: activeMethod,
        provider,
        cardNumber,
      });

      // 2. Buat pesanan setelah pembayaran berhasil
      const { data: order } = await api.post("/orders", {
        items: cartItems.map((item) => ({ productId: item.productId, qty: item.qty })),
        shippingAddress: shipping,
        paymentMethod: activeMethod,
        paymentDetails: {
          provider: paymentResult.provider,
          transactionId: paymentResult.transactionId,
          paidAt: paymentResult.paidAt,
        },
      });

      clearCart();
      toast.success("Pembayaran berhasil!");
      navigate(`/order-success/${order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memproses pembayaran");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Data Pengiriman */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100"
          >
            <h3 className="font-semibold text-lg mb-4">Alamat Pengiriman</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="fullName"
                placeholder="Nama Lengkap"
                value={shipping.fullName}
                onChange={handleShippingChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                name="phone"
                placeholder="No. Telepon"
                value={shipping.phone}
                onChange={handleShippingChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                name="address"
                placeholder="Alamat Lengkap"
                value={shipping.address}
                onChange={handleShippingChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                name="city"
                placeholder="Kota"
                value={shipping.city}
                onChange={handleShippingChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                name="postalCode"
                placeholder="Kode Pos"
                value={shipping.postalCode}
                onChange={handleShippingChange}
                className="border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </motion.div>

          {/* Metode Pembayaran */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100"
          >
            <h3 className="font-semibold text-lg mb-4">Metode Pembayaran</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {paymentTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMethod(tab.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      activeMethod === tab.id
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-medium text-center">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {activeMethod === "credit_card" ? (
                <motion.div
                  key="credit_card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="grid sm:grid-cols-3 gap-2 mb-2">
                    {methods.credit_card.map((c) => (
                      <button
                        key={c}
                        onClick={() => setProvider(c)}
                        className={`py-2 rounded-lg border text-sm font-medium ${
                          provider === c
                            ? "border-primary-600 bg-primary-50 text-primary-700"
                            : "border-slate-200 text-slate-500"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <input
                    placeholder="Nomor Kartu"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    placeholder="Nama di Kartu"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex gap-3">
                    <input
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-1/2 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      placeholder="CVV"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-1/2 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeMethod}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid sm:grid-cols-3 gap-2 overflow-hidden"
                >
                  {(methods[activeMethod] || []).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-colors ${
                        provider === p
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {provider === p && <CheckCircle2 size={14} />}
                      {p}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Ringkasan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100 h-fit"
        >
          <h3 className="font-semibold text-lg mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-2 max-h-56 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-slate-600">
                <span className="line-clamp-1">
                  {item.name} x{item.qty}
                </span>
                <span>{formatRupiah(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm text-slate-600 border-t pt-4 mb-4">
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
            <span>{formatRupiah(total)}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePayNow}
            disabled={processing}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            {processing ? "Memproses..." : `Bayar ${formatRupiah(total)}`}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
