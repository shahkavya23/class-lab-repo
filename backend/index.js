import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import route_user from "../backend/routes/customer.routes.js"
import route_product from "../backend/routes/product.routes.js"
import route_wishlist from "../backend/routes/wishlist.routes.js"
import route_cart from "../backend/routes/cart.routes.js"
import cors from 'cors'
import route_order from "./routes/order.routes.js";


dotenv.config()

mongoose.connect(process.env.dbURL).then(() => {
    console.log('DB connected')
}).catch((err) => {
    console.log(err)
})

const app = express()
// const cors = require('cors')

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true
}))

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});


app.use(express.json())
app.use(cookieParser())

const port =  8082


app.use('/customers' , route_user)
app.use('/products' , route_product )
app.use('/wishlist' , route_wishlist)
app.use('/cart' , route_cart)
app.use('/orders' , route_order)




app.listen(port , () => {
    console.log(`Server connected to port number : ${port}`)
})






