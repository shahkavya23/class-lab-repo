import Customer from "../models/customer.model.js"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"

export const registration = async (req, res) => {
    const { fullName, email, password, phone } = req.body

    try {

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ Message: "Missing Fields" })
        }

        if (password.length < 6) {
            return res.status(400).json({ Message: "Psssword length should be greater than or equal to 6" })
        }

        const foundEmail = await Customer.findOne({ email })

        if (foundEmail) {
            return res.status(409).json("Email already exist")
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newCustomer = await Customer.create({ fullName, email, password: hashedPassword, phone })

        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            "customer": {
                _id: newCustomer._id,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone
            }
        })

    } catch (err) {
        console.error("Server Error in registration:", err);
        return res.status(500).json({ Message: "Server error during registration" });
    }


}


export const login = async (req, res) => {

    try {

        const { email, password } = req.body

        const foundEmail = await Customer.findOne({ email })

        if (!foundEmail) {
           return  res.status(401).json("Invalid email or password")
        }


        const compare_password = await bcrypt.compare(password, foundEmail.password)

        if(!compare_password){
           return  res.status(401).json("Invalid email or password")
        }

        const token = jwt.sign({id : foundEmail._id} , process.env.JWT_SECRET , {expiresIn :  "7d"})

        res.cookie("token" , token , {httpOnly : true})
        res.status(200).json({
            success : true,
            message : "Login Successful"

        })

    }
    catch (err) {
        console.error("Login server error:", err);
        return res.status(500).json("Internal server error during login");
    }

}

export const myProfile = async (req,res) => {
    res.status(200).json(req.user)
}

export const logout = async (req,res) => {
    res.clearCookie('token')

    res.status(200).json({
        "success" : true,
        "message" : "Logged out successfully"
    })
}