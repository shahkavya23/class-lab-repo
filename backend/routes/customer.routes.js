import express from "express"


import { registration , login , myProfile , logout } from "../controllers/customer.controller.js"

import { authenticateUser } from "../middlewares/auth.middlewares.js"

const router = express.Router()


router.post("/register" , registration)

router.post("/login" , login)

router.get("/me" , authenticateUser , myProfile)

router.post('/logout' , logout)


export default router