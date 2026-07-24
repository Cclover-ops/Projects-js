// Controller ini men-SIMULASIKAN proses pembayaran (bank transfer, kartu kredit, e-wallet).
// Untuk produksi nyata, ganti logic ini dengan integrasi payment gateway
// seperti Midtrans, Xendit, atau Stripe (tinggal panggil API mereka di sini).

const BANKS = ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga"];
const EWALLETS = ["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"];

// @desc    Ambil daftar metode pembayaran yang tersedia
// @route   GET /api/payment/methods
exports.getPaymentMethods = async (req, res) => {
  res.json({
    bank_transfer: BANKS,
    credit_card: ["Visa", "Mastercard", "JCB"],
    e_wallet: EWALLETS,
  });
};

// @desc    Proses pembayaran (simulasi)
// @route   POST /api/payment/process
exports.processPayment = async (req, res) => {
  try {
    const { method, provider, cardNumber } = req.body;

    if (!method) {
      return res.status(400).json({ message: "Metode pembayaran wajib diisi" });
    }

    // Validasi sederhana per metode
    if (method === "credit_card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 12) {
        return res.status(400).json({ message: "Nomor kartu tidak valid" });
      }
    }
    if ((method === "bank_transfer" || method === "e_wallet") && !provider) {
      return res.status(400).json({ message: "Pilih penyedia (bank / e-wallet)" });
    }

    // Simulasi delay & transaksi berhasil
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    res.json({
      success: true,
      transactionId,
      method,
      provider: provider || cardNumber?.slice(-4),
      paidAt: new Date(),
      message: "Pembayaran berhasil diproses",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
