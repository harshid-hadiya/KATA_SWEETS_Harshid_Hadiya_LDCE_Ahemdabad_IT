const Sweet = require("../models/Sweet");
const mongoose = require("mongoose");

exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const sweet = new Sweet({ name, category, price, quantity });
    const savedSweet = await sweet.save();
    res.status(201).json(savedSweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSweet = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid sweet ID" });
  }
  try {
    const sweet = await Sweet.findByIdAndDelete(id);
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }
    res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
