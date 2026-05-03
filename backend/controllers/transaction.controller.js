import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Transaction } from "../models/transaction.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";

const makePayment = asyncHandler(async(req ,res)=>{
    const {categoryId, amount, upiPin, merchantName, upiId} =req.body

    if (!categoryId || !amount || amount <= 0) {
        throw new ApiError(400, "Category and valid amount are required");
    }

    if (!upiPin) {
        throw new ApiError(400, "UPI PIN is required");
    }

///here we verify pin
    const user = await User.findById(req.user._id)

    const isPinValid = await user.isUpiPinCorrect(upiPin)

    if (!isPinValid) {
        throw new ApiError(401, "Invalid UPI PIN")
    }

///getting category
    const category = await Category.findById(categoryId)

    if (!category) {
        throw new ApiError(404, "Category not found")
    }

    if (category.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access to category");
    }

/// calculate spent amount
    const transactions = await Transaction.find({
        categoryId
    })

    const spent = transactions.reduce((acc, txn) => acc + txn.amount, 0)

/// budget enforcement
    if (spent + amount > category.limit) {

        // Save failed transaction
        const failedTxn = await Transaction.create({
            userId: req.user._id,
            categoryId,
            amount,
            status: "FAILED",
            method: "SIMULATED_UPI",
            merchantName,
            upiId
        });

        throw new ApiError(400, "Category budget exceeded");
    }

    ///Save successful transaction
    const transaction = await Transaction.create({
        userId: req.user._id,
        categoryId,
        amount,
        status: "SUCCESS",
        method: "SIMULATED_UPI",
        merchantName,
        upiId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                transaction,
                "Payment successful"
            )
        )

})

const getTransactions = asyncHandler(async (req, res) => {

    const transactions = await Transaction.find({
        userId: req.user._id
    }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                transactions,
                "Transactions fetched successfully"
            )
        );
});

const getTransactionsByCategory = asyncHandler(async (req, res) => {

    const { categoryId } = req.params;
    const { startDate, endDate } = req.query;

    if (!categoryId) {
        throw new ApiError(400, "Category ID is required");
    }

    const query = {
        userId: req.user._id,
        categoryId
    };

    if (startDate && endDate) {
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                transactions,
                "Category transactions fetched successfully"
            )
        );
});

export {
    makePayment,
    getTransactions,
    getTransactionsByCategory
}

