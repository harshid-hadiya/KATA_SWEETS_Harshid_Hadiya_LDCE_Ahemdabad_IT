const express = require("express");
const router = express.Router();
const sweetController = require("../controllers/sweetController");
const verifyOwnerJWT = require("../middleware/auth");

router.post("/", verifyOwnerJWT, sweetController.addSweet);

router.delete("/:id", verifyOwnerJWT, sweetController.deleteSweet);

router.get("/", sweetController.getAllSweets);

router.get("/search", sweetController.searchAndSortSweets);

router.patch("/:id/restock", verifyOwnerJWT, sweetController.restockSweet);

module.exports = router;
