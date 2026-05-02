import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    budgetId: {
        type: Schema.Types.ObjectId,
        ref: "Budget",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    limit: {
        type: Number,
        required: true
    },

    ratio: {
        type: Number,   // used for auto distribution
        default: 0
    }

}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);