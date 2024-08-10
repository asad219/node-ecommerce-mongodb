
import express from 'express';
const router = express.Router();
import {validateToken} from '../middlewares/validateTokenHandler.js';
import { getAll, registerController, login, getUserById } from '../controllers/userController.js';

router.get("/getall", validateToken, getAll);
router.get("/:id", validateToken,getUserById);
router.post("/register", registerController);
router.post("/login", login);

export default router;

