import express from "express";
const router = express.Router();

import { validateToken, verifyTokenAndAdmin } from "../middlewares/validateTokenHandler.js";
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


router.get("/", async (req, res) => {
  try {
    res.status(200).json({success: true, message:"up and running");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/get-all", getAllPrductsController);
router.get("/:id", getSingleProductController);
router.post(
  "/create-product",
  validateToken,
  verifyTokenAndAdmin,
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
