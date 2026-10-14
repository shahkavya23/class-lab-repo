import express from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
    createPaymentOrder,
    verifyPayment,
    getMyOrders,
    getOrderById
} from "../controllers/order.controller.js";

const router = express.Router();

// 1. Create pending ShopKart order + Razorpay order
router.post("/create-payment-order", authenticateUser, createPaymentOrder);

// 2. Verify payment signature and mark order PAID
router.post("/verify-payment", authenticateUser, verifyPayment);

// 3. Fetch all orders for current user
router.get("/", authenticateUser, getMyOrders);

// 4. Fetch single order by ID (with ownership check)
router.get("/:id", authenticateUser, getOrderById);

export default router;
