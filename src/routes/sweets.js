const express = require("express");
const router = express.Router();
const sweetController = require("../controllers/sweetController");
const verifyOwnerJWT = require("../middleware/auth");

router.post("/", verifyOwnerJWT, sweetController.addSweet);

router.delete("/:id", verifyOwnerJWT, sweetController.deleteSweet);
module.exports = router;
