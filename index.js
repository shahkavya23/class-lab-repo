import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import route_user from "../backend/routes/customer.routes.js"

dotenv.config()

mongoose.connect(process.env.dbURL).then(() => {
    console.log('DB connected')
}).catch((err) => {
    console.log(err)
})

const app = express()

app.use(express.json())
app.use(cookieParser())

const port =  8082


app.use('/customers' , route_user)



app.listen(port , () => {
    console.log(`Server connected to port number : ${port}`)
})






