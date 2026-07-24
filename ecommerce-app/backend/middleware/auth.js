const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: pastikan user sudah login (token valid)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User tidak ditemukan, token tidak valid" });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Tidak terautentikasi, token tidak valid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Tidak terautentikasi, token tidak ditemukan" });
  }
};

// Middleware: pastikan user memiliki role admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Akses ditolak, khusus admin" });
};

module.exports = { protect, adminOnly };
