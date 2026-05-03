import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Budget } from "../models/budget.model.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, limit, ratio } = req.body;

    if (!name || !limit || limit <= 0) {
        throw new ApiError(400, "Name and valid limit are required");
    }

    const budget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    })
    
    if (!budget) {
        throw new ApiError(404, "No active budget found");
    }

    const existingCategory = await Category.findOne({
        userId: req.user._id,
        budgetId: budget._id,
        name
    })

    if (existingCategory) {
        throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({
        userId: req.user._id,
        budgetId: budget._id,
        name,
        limit,
        ratio: ratio || 0
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                category,
                "Category created successfully"
            )
        )

})

const getCategories = asyncHandler(async (req, res) => {

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
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                categories,
                "Categories fetched successfully"
            )
        )
})

export {
    createCategory,
    getCategories
}