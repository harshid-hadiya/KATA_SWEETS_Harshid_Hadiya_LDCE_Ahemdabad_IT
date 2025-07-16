const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");

router.post("/login", ownerController.loginOwner);

module.exports = router;
