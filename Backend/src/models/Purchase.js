const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  sweet: { type: mongoose.Schema.Types.ObjectId, ref: "Sweet", required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
