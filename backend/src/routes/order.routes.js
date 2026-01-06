import express from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getOrdersByPharmacy        // 👈 add this
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);


router.get("/pharmacy/:pharmacyId", protect, getOrdersByPharmacy);

router.put("/:id", protect, updateOrderStatus);

export default router;
