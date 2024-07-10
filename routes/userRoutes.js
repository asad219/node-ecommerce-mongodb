const express = require('express');
const router = express.Router();

const { getAll, register, login, getUserById } = require('../controllers/userController');

router.get("/getall", getAll);
router.get("/:id", getUserById);
router.post("/register", register);
router.post("/login", login);

module.exports = router;