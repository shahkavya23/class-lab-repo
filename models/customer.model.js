import mongoose from "mongoose"

const customerSchema =  mongoose.Schema({
    "fullName" : {
        type : String,
        required : true
    },
    "email" : {
        type : String,
        required : true,
        unique : true
    },
    "password" : {
        type : String,
        required : true 
    },
    "phone" : {
        type : String,
        required : true 
    },
    "createdAt" : {
        type : Date,
        default : Date.now
    }

})


export default mongoose.model("customer" , customerSchema)