import mongoose,{ Schema } from "mongoose"

const walletSchema=new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export const Wallet=mongoose.model("Wallet",walletSchema)