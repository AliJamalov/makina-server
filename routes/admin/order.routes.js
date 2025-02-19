import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
  getOrdersByUserId,
} from "../../controllers/client/order.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createOrder);

router.get("/", getOrders);

router.get("/:userId", getOrdersByUserId);

router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

export default router;
