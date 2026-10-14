import express from "express"
import { authenticateUser } from "../middlewares/auth.middlewares.js"
import { addToCart , getCart , updateQuantity , removeFromCart } from "../controllers/cart.controller.js"

const router = express.Router()

router.post("/:productId" , authenticateUser , addToCart)

router.get("/" , authenticateUser , getCart)

router.patch("/:productId" , authenticateUser , updateQuantity)

router.delete("/:productId"  , authenticateUser , removeFromCart)


export default router


