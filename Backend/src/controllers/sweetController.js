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

exports.getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchAndSortSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice)))
        filter.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice)))
        filter.price.$lte = Number(maxPrice);
      if (Object.keys(filter.price).length === 0) delete filter.price;
    }
    let sort = {};
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      sort[sortBy] = order;
    }
    const sweets = await Sweet.find(filter).sort(sort);
    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.restockSweet = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive number" });
  }
  try {
    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: "Sweet not found" });
    }
    sweet.quantity += quantity;
    await sweet.save();
    res.status(200).json({ message: "Sweet restocked", sweet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
