const express = require("express");
const router = express.Router();
const { getPaymentMethods, processPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.get("/methods", getPaymentMethods);
router.post("/process", protect, processPayment);

module.exports = router;
