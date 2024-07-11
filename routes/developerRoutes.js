const express = require('express');
const router = express.Router();

const { generateApiKey } = require('../controllers/developerController');

router.post("/generate", generateApiKey);

module.exports = router;