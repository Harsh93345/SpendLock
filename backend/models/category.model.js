import mongoose, {Schema} from "mongoose"

const categorySchema=new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    limit:{
        type:Number,
        required:true
    }
},{timestamps:true});

export const Category=mongoose.model("Category",categorySchema)