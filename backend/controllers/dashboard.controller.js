import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Budget } from "../models/budget.model.js";
import { Category } from "../models/category.model.js";
import { Transaction } from "../models/transaction.model.js";

const getDashboard = asyncHandler(async (req, res) => {

    const budget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    });

    if (!budget) {
        throw new ApiError(404, "No active budget found");
    }

    const categories = await Category.find({
        userId: req.user._id,
        budgetId: budget._id
    });

    const result = [];

    for (const category of categories) {

        const transactions = await Transaction.find({
            categoryId: category._id
        });

        const spent = transactions.reduce((acc, txn) => acc + txn.amount, 0);

        result.push({
            categoryId: category._id,
            name: category.name,
            limit: category.limit,
            spent,
            remaining: category.limit - spent
        });
    }

    const totalSpent = result.reduce((acc, cat) => acc + cat.spent, 0);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalBudget: budget.totalAmount,
                    totalSpent,
                    categories: result
                },
                "Dashboard fetched successfully"
            )
        );
});

export {
    getDashboard
};