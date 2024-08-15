
import express from 'express';
const router = express.Router();
import {validateToken} from '../middlewares/validateTokenHandler.js';
import { getAllController, registerController, loginController, getUserProfileController, logoutController, updateProfile } from '../controllers/userController.js';

router.get("/getall", validateToken, getAllController);
router.get("/:id", validateToken,getUserProfileController);
router.put("/updateprofile/:id", validateToken,updateProfile);
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", validateToken, logoutController);

export default router;

