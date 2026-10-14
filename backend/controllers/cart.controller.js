import mongoose from "mongoose"
import Product from "../models/products.model.js"


export const addToCart = async (req, res) => {
    const { productId } = req.params

    if (!mongoose.isObjectIdOrHexString(productId)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const user = req.user

    const product = await Product.findById(productId)

    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (product.stock === 0) {
        return res.status(400).json({ success: false, message: "Product is out of stock" });
    }


    const cartItemIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId
    )

    if (cartItemIndex === -1) {
        user.cart.push({
            product: productId,
            quantity: 1
        })

    }
    else {
        if (user.cart[cartItemIndex].quantity + 1 > product.stock) {
            return res.status(400).json({ success: false, message: "Cannot exceed available stock" });
        }

        user.cart[cartItemIndex].quantity += 1
    }

    await user.save()

    res.status(200).json({ "message": "success" })

}


export const getCart = async (req, res) => {
    const user = req.user

    const user_array_with_product = await user.populate("cart.product")

    return res.status(200).json({
        "success": true,
        "cart": user_array_with_product.cart
    })
}

export const updateQuantity = async (req, res) => {

    const { productId } = req.params
    const quantity = req.body.quantity

    if (!mongoose.isObjectIdOrHexString(productId)) {
        return res.status(400).json({ success: false, message: "Invalid product ID" })
    }

    const user = req.user//already handed by the middleware so need of await over here 

    const product = await Product.findById(productId)




    
        if (quantity < 1){
            return res.status(400).json({"message" : "Items cannot be less than one"})
        }
        else if (!product){
            return res.status(404).json({"message" : "Product not found"})
        }
        else if (quantity > product.stock){
            return res.status(400).json({"message" : "Can't have quantity above the stock available "})
        }




        const user_product_index = user.cart.findIndex(
            (item) => item.product.toString() === productId
        )


        if (user_product_index === -1){
            return res.status(404).json({"Message" : "Product not found inside the user cart"})
        }

    
        


        user.cart[user_product_index].quantity = quantity


        await user.save()

        res.status(201).json({"Message" : "Quantity Updated"})
}


export const  removeFromCart = async (req,res) => {

    const {productId} = req.params

    const user = req.user

    user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
    )

    await user.save()

    return res.status(200).json({"message" : "Deleted Successfully" , "cart" : user.cart})

}



