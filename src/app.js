const express = require("express");
const mongoose = require("mongoose");
const ownerRoutes = require("./routes/owner");
const customerRoutes = require("./routes/customer"); 
const sweetsRouter = require("./routes/sweets");
const purchaseRouter = require("./routes/purchase");

const app = express();
const cors = require("cors");
app.use(cors());
mongoose.connect(
  process.env.MONGO_URL || "mongodb://localhost:27017/sweetshop",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(express.json());
app.use("/api/owner", ownerRouter);
app.use("/api/customers", customerRouter);
app.use("/api/sweets", sweetsRouter);
app.use("/api", purchaseRouter);

module.exports = app;
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});