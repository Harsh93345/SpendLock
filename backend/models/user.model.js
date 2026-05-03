import mongoose,{Schema} from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema=new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    upiPin:{
        type:Number,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:[true,"Please enter a password"]
    }
},{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.pre("save", async function () {
    if (!this.isModified("upiPin")) return;

    this.upiPin = await bcrypt.hash(this.upiPin.toString(), 10);
});

userSchema.methods.isUpiPinCorrect = async function(upiPin){
    return await bcrypt.compare(upiPin.toString(), this.upiPin)
}

userSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)