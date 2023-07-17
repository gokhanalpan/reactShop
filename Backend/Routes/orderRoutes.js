import express from "express";
const router = express.Router();
import {
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrderById,
  getMyOrders,
  addOrderItems,
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.post("/",protect, addOrderItems);

router.get("/",protect,admin, getAllOrders);

router.get("/myOrders",protect, getMyOrders);

router.get("/:id",protect, getOrderById);

router.put("/:id/pay",protect, updateOrderToPaid);

router.put("/:id/deliver",protect,admin, updateOrderToDelivered);

export default router;
