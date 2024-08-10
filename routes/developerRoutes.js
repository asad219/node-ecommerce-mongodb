import express from 'express';
const router = express.Router();

import {generateApiKey}  from '../controllers/developerController.js';

router.post("/generate", generateApiKey);

export default router;