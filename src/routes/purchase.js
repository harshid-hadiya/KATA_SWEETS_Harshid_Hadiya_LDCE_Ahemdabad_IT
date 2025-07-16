const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");
const verifyCustomerJWT = require("../middlewares/customerAuth");

router.post(
  "/sweets/:id/purchase",
  verifyCustomerJWT,
  purchaseController.purchaseSweet
);

module.exports = router;
