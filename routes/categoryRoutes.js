import express from "express";
const router = express.Router();

import {
  getAllCategoriesController,
  createCategoryController,
  getCategoryByIdController,
  deleteCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { validateToken } from "../middlewares/validateTokenHandler.js";

router.get("/get-all", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.delete("/:id", validateToken, deleteCategoryController);
router.put("/:id", validateToken, updateCategoryController);
router.post("/create-category", validateToken, createCategoryController);

export default router;
