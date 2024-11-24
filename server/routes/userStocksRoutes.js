const express = require ("express");
const router = express.Router();
const {createUserStock, deleteUserStock} = require('../controllers/userStockController');

// Creates a new entry
router.post("/us/", createUserStock);

router.delete("/us/", deleteUserStock);

module.exports = router;