import mongoose from "mongoose";

const ProductSchema =  mongoose.Schema({
    "name" : {
        type : String,
        required : true 
    },
    "description" : {
        type : String , 
        required:true 
    },
    "category" : {
        type : String , 
        required : true 
    },
    "image" : {
        type : String , 
        required : true 
    },
    "price" : {
        type : Number ,
        required : true , 
        min : 0
    },
    "stock" : {
        type : Number , 
        required : true , 
        min : 0
    },
    "createdAt" : {
        type : Date,
        default : Date.now
    }
})


export default mongoose.model("product" , ProductSchema)