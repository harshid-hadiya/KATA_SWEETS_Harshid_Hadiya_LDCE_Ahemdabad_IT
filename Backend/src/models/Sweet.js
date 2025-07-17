const mongoose = require("mongoose");

const sweetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "chocolate",
      "candy",
      "pastry",
      "barfi",
      "laddu",
      "halwa",
      "cookie",
      "brownie",
      "fudge",
      "toffee",
      "marzipan",
      "truffle",
      "muffin",
      "cake",
      "tart",
      "brittle",
      "peda",
      "gulab jamun",
    ],
  },

  // here this all category are added by the ai generated


  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model("Sweet", sweetSchema);
