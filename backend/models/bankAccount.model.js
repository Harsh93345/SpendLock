import mongoose, { Schema } from "mongoose";

const bankAccountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const BankAccount = mongoose.model("BankAccount", bankAccountSchema);