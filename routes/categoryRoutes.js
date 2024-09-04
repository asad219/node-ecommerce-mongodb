import express from 'express';
const router = express.Router();

import { getAllCategoriesController, createCategoryController, getCategoryByIdController, deleteCategoryController } from '../controllers/categoryController.js';
import { validateToken } from '../middlewares/validateTokenHandler.js';

router.get("/get-all", getAllCategoriesController);
router.get("/:id", getCategoryByIdController)
router.delete("/:id", validateToken, deleteCategoryController)
router.post("/create-category", validateToken, createCategoryController)

export default router;