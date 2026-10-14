import express from "express"
import {createProduct , getAllProducts , getSingleProduct} from "../controllers/products.controller.js"


const router  =  express.Router()

router.post("/" , createProduct)

router.get("/" , getAllProducts)

router.get("/:id" , getSingleProduct)


export default router 