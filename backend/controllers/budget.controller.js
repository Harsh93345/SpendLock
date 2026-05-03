import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Budget } from "../models/budget.model.js";
import { Wallet } from "../models/wallet.model.js";

const createBudget = asyncHandler(async(req ,res )=>{
    
    const {totalAmount, startDate, endDate} =req.body
    
    if (!totalAmount || totalAmount <= 0) {
        throw new ApiError(400, "Invalid budget amount");
    }

    if (!startDate || !endDate) {
        throw new ApiError(400, "Start date and end date are required");
    }

    if (new Date(startDate) >= new Date(endDate)) {
        throw new ApiError(400, "End date must be greater than start date");
    }

    const wallet = await wallet.sindOne({ userId: req.user._id })

    if(!wallet){
        throw new ApiError(404, "Wallet not found")
    }

    if(wallet.balance < totalAmount){
        throw new ApiError(400, "Insufficient wallet balance")
    }

    const existingBudget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    })

    if(existingBudget){
        throw new ApiError(400, "Active budget already exists")
    }

    const budget = await Budget.create({
        userId: req.user._id,
        totalAmount,
        startDate,
        endDate,
        isActive: true
    })

    wallet.balance -= totalAmount
    await wallet.save({validateBeforeSave: false})

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            budget,
            "Budget created successfully"))

})

const getActiveBudget = asyncHandler(async (req, res) => {

    const budget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    });

    if (!budget) {
        throw new ApiError(404, "No active budget found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                budget,
                "Budget fetched successfully"
            )
        );
})

const addMoneyToActiveBudget = asyncHandler(async (req, res) => {

    const { amount, mode, categories } = req.body;

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    const budget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    });

    if (!budget) {
        throw new ApiError(404, "No active budget found");
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet || wallet.balance < amount) {
        throw new ApiError(400, "Insufficient wallet balance");
    }

    const existingCategories = await Category.find({
        userId: req.user._id,
        budgetId: budget._id
    });

    if (mode === "AUTO") {

        // distribute based on ratio
        for (const cat of existingCategories) {

            const share = (cat.ratio / 100) * amount;

            cat.limit += share;
            await cat.save({ validateBeforeSave: false });
        }

    } else if (mode === "MANUAL") {

        if (!categories || categories.length === 0) {
            throw new ApiError(400, "Categories allocation required");
        }

        for (const item of categories) {

            const cat = await Category.findById(item.categoryId);

            if (!cat) continue;

            cat.limit += item.amount;
            await cat.save({ validateBeforeSave: false });
        }

    } else {
        throw new ApiError(400, "Invalid mode");
    }

    // update budget + wallet
    budget.totalAmount += amount;
    await budget.save({ validateBeforeSave: false });

    wallet.balance -= amount;
    await wallet.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Money added to budget successfully"
            )
        );
})

const closeBudget = asyncHandler(async (req, res) => {

    const budget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    });

    if (!budget) {
        throw new ApiError(404, "No active budget found");
    }

    budget.isActive = false;
    await budget.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                budget,
                "Budget closed successfully"
            )
        );
})

const checkAndExpireBudget = asyncHandler(async (req, res) => {

    const budget = await Budget.findOne({
        userId: req.user._id,
        isActive: true
    });

    if (!budget) {
        throw new ApiError(404, "No active budget found");
    }

    const now = new Date();

    if (now >= new Date(budget.endDate)) {
        budget.isActive = false;
        await budget.save({ validateBeforeSave: false });

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                budget,
                "Budget expired and closed automatically"
            )
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            budget,
            "Budget is still active"
        )
    );
});

export {
    createBudget,
    getActiveBudget,
    addMoneyToActiveBudget,
    closeBudget,
    checkAndExpireBudget
};