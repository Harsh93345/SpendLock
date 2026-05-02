import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wallet } from "../models/wallet.model.js";
import { BankAccount } from "../models/bankAccount.model.js";

const createWallet = asyncHandler(async(req, res)=>{
    const existingWallet = await Wallet.findOne({ userId: req.user._id })

    if(existingWallet){
        throw new ApiError(400, "Wallet already exists")
    }

    const wallet = await Wallet.create({
        userId: req.user._id,
        balance: 0
    })
    return res
    .status(201)
    .json(
    new ApiResponse(
        200,
        wallet,
        "Wallet created successfully"
    ))

})
const addMoneyToWallet = asyncHandler(async(req, res)=>{
    const { amount } = req.body

    if(!amount || amount <= 0){
        throw new ApiError(400, "Invalid amount")
    }

    const wallet = await Wallet.findOne({ userId: req.user._id })
    if(!wallet){
        throw new ApiError(404, "Wallet not found")
    }

    wallet.balance += amount;
    await wallet.save({validateBeforeSave: false});
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            wallet,
            "Money added to wallet successfully"
        )
    )
})

const getWallet = asyncHandler(async(req, res)=>{
    const wallet = await Wallet.findOne({ userId: req.user._id })

    if(!wallet){
        throw new ApiError(404, "Wallet not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            wallet,
            "Wallet fetched successfully"
        )
    )
})

const transferFromBankToWallet = asyncHandler(async(req ,res )=>{
    
    const { bankId, amount, upiPin } = req.body

    if (!amount || amount <= 0) {
        throw new ApiError(400, "Invalid amount");
    }

    if (!upiPin) {
        throw new ApiError(400, "UPI PIN is required");
    }

    const user = await User.findById(req.user._id)
    
    const isUpiPinCorrect = await user.isUpiPinCorrect(upiPin)
    
    if (!isUpiPinCorrect) {
        throw new ApiError(401, "Invalid UPI PIN");
    }

    const bank = await BankAccount.findById(bankId)

    if (!bank){
        throw new ApiError(404, "Bank account not found");
    }

    if (bank.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access to bank account");
    }

    if (bank.balance < amount) {
        throw new ApiError(400, "Insufficient bank balance");
    }

    const wallet = await Wallet.findOne({ userId: req.user._id })

    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }   

    // Deduct from bank

    bank.balance -= amount;
    await bank.save({ validateBeforeSave: false });

    // Add to wallet
    wallet.balance += amount;
    await wallet.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { wallet, bank },
            "Money transferred to wallet successfully"
        )
    )
})
export {
    createWallet,
    addMoneyToWallet,
    getWallet,
    transferFromBankToWallet
};

