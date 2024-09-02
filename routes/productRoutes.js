import express from "express";
const router = express.Router();

import { validateToken } from "../middlewares/validateTokenHandler.js";
import {
  getAllPrductsController,
  createProductController,
  getSingleProductController,
  updateProductController,
  updateProductImageController,
  deleteProductImageController,
  deleteProductController,
} from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";

router.get("/get-all", getAllPrductsController);
router.get("/:id", getSingleProductController);
router.post(
  "/create-product",
  validateToken,
  singleUpload,
  createProductController
);
router.put("/:id", validateToken, updateProductController);
router.put(
  "/upload-image/:id",
  validateToken,
  singleUpload,
  updateProductImageController
);
router.delete("/delete-image/:id", validateToken, deleteProductImageController);
router.delete("/:id", validateToken, deleteProductController);

export default router;
