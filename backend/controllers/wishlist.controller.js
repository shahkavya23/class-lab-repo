import Customer from "../models/customer.model.js"

export const addToWishlist = async (req,res) => {

    try{

    const {productId} =  req.params
    const user =  req.user
    const userId =  req.user._id
    
    if (user.wishlist.includes(productId)){
        return res.status(409).json({"message" : "Id already exist in the wishlist"})
    }

    const wishlist = req.user.wishlist.push(productId)

    await req.user.save()//Like Microsoft word ones open needed to be saved and close
    
    res.status(200).json({
        "success" : true , 
        "message" : "Product added to wishlist"
    })

    }
    catch(error){
        console.log(error)
        res.status(500).json({success : false , message : "Server Error"})
    }

}


export const getWishlist =  async (req,res) => {
    try{

    const userId =  req.user._id

    const user =  await Customer.findById(userId).populate("wishlist")//Look inside the wishlist array, take every single passport number (ObjectId) you find, go over to the Products collection, and swap the passport number with the actual Product data!


    res.status(200).json({
        "success" : true , 
        "wishlist" : user.wishlist
    })
    }
    catch(error){
        console.log(error)
        res.status(404).json({"message" : "server error"})
    }
}



export const removeFromWishlist = async (req,res) => {
    try{

        const user = req.user

        const {productId} = req.params

        req.user.wishlist.pull(productId)

        await req.user.save()

        res.status(200).json({"message" : "Deleted successfully"})

    }
    catch(error){
        console.log(error)
        res.status(404).send("Server error not able to delete wishlist")
    }
}