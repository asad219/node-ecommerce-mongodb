import express from "express";
const router = express.Router();
import { validateToken } from "../middlewares/validateTokenHandler.js";
import {
  getAllController,
  registerController,
  loginController,
  getUserProfileController,
  logoutController,
  updateProfileController,
  updatePasswordController,
  uploadPrifilePicController,
} from "../controllers/userController.js";
import { singleUpload } from "../middlewares/multer.js";

router.get("/getall", validateToken, getAllController);
router.get("/:id", validateToken, getUserProfileController);
router.put("/updateprofile/:id", validateToken, updateProfileController);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", validateToken, logoutController);
router.put("/updatepassword", validateToken, updatePasswordController);
router.put("/updateprofilepicture", validateToken, singleUpload, uploadPrifilePicController)

export default router;
