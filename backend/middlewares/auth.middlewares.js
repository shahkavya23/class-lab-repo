import jwt from "jsonwebtoken"
import Customer from "../models/customer.model.js"    


export const authenticateUser = async (req,res,next) => {

    try{
    const token =  req.cookies.token

    if(!token){
        return res.status(401).json({message : "Unauthorized : No token provided"})
    }

    const decoded =  jwt.verify(token , process.env.JWT_SECRET)

    const user =  await Customer.findById(decoded.id)

    if (!user){
        return res.status(404).json({Message  : "Mot user found"})
    }

    req.user = user



    next()
}
catch(err){
    return res.status(500).json({Message : "Server Error"})
}
}