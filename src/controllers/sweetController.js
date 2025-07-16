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
