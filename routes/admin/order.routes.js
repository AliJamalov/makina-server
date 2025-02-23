import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
  getOrdersByUserIdForAdmin,
  getUserOrders,
} from "../../controllers/client/order.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/", getOrders);

router.get("/user-orders", verifyToken, getUserOrders);

router.get("/:userId", getOrdersByUserIdForAdmin);

router.delete("/:userId", verifyToken, verifyAdmin, deleteOrder);

export default router;
