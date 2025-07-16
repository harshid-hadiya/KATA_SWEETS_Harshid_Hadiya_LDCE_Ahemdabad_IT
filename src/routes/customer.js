const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/login", customerController.createOrLoginCustomer);

module.exports = router;
 