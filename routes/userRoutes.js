const express = require('express');
const router = express.Router();
const authenticateKey = require('../middlewares/authApi');
const validateToken = require('../middlewares/validateTokenHandler');
const { getAll, register, login, getUserById } = require('../controllers/userController');

router.get("/getall", authenticateKey, getAll);
router.get("/:id", getUserById);
router.post("/register", register);
router.post("/login", login);

module.exports = router;

