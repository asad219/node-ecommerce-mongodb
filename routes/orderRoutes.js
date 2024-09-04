import express from "express";
import {
  validateToken,
  verifyTokenAndAuthorization,
} from "../middlewares/validateTokenHandler.js";
import {
  createOrderController,
  getAllOrderController,
} from "../controllers/orderController.js";
const router = express.Router();

//Get All user orders
router.get(
  "/get-orders/:id",
  validateToken,
  verifyTokenAndAuthorization,
  getAllOrderController
);

//Create Order
router.post("/create", validateToken, createOrderController);

export default router;
