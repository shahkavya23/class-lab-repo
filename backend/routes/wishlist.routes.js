import express from "express"
import {authenticateUser} from "../middlewares/auth.middlewares.js"
import {addToWishlist, getWishlist, removeFromWishlist} from "../controllers/wishlist.controller.js"


const router = express.Router()

router.post("/:productId" , authenticateUser , addToWishlist)


router.get("/" , authenticateUser , getWishlist)

router.delete("/:productId" , authenticateUser , removeFromWishlist)


export default router