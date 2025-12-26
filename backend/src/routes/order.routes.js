import express from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my", protect, getMyOrders);

// Update order status (picked / expired)
router.put("/:id", protect, updateOrderStatus);

export default router;
