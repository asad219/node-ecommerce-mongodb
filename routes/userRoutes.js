const express = require('express');
const router = express.Router();
const authenticateKey = require('../middlewares/authApi');
const { getAll, register, login, getUserById } = require('../controllers/userController');
//user routes// again added //Asad Khan
router.get("/getall", authenticateKey, getAll);
router.get("/:id", getUserById);
router.post("/register", register);
router.post("/login", authenticateKey, login);

module.exports = router;

