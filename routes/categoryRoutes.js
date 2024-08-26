import express from 'express';
const router = express.Router();

import { getAllCategoriesController, createCategoryController } from '../controllers/categoryController.js';
import { validateToken } from '../middlewares/validateTokenHandler.js';

router.get("/get-all", getAllCategoriesController);
router.post("/create-category", validateToken, createCategoryController)

export default router;