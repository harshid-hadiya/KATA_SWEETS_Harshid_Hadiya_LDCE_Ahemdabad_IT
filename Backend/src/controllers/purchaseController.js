const Sweet = require("../models/Sweet");
const Customer = require("../models/Customer");
const Purchase = require("../models/Purchase");

exports.purchaseSweet = async (req, res) => {
  const sweetId = req.params.id;
  const { quantity } = req.body;
  const customerId = req.customerId;
  if (!customerId || !quantity) {
    return res
      .status(400)
      .json({ error: "Customer authentication and quantity are required" });
  }
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }
    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }
    sweet.quantity -= quantity;
    await sweet.save();
    const priceAtPurchase = sweet.price;
    const totalPrice = priceAtPurchase * quantity;
    const purchase = new Purchase({
      customer: customer._id,
      sweet: sweet._id,
      quantity,
      priceAtPurchase,
      totalPrice,
    });
    await purchase.save();
    res.status(201).json({ message: "Purchase successful", purchase });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
