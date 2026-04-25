import mongoose,{ Schema } from "mongoose"

const transactionSchema=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    amount:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        enum:["PENDING","SUCCESS","FAILED"],
        default:"SUCCESS"
    },
    method:{
        type:String,
        default:"SIMULATED_UPI"
    },
    merchantName: String,
    upiId: String
},{timestamps:true});

export const Transaction=mongoose.model("Transaction",transactionSchema)