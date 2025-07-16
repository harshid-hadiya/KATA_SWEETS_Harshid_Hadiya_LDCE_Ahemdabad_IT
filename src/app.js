const express = require("express");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());

mongoose.connect(
  process.env.MONGO_URL || "mongodb://localhost:27017/sweetshop",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = app;
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});