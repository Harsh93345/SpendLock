import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BankAccount } from "../models/bankAccount.model.js";

const addBankAccount = asyncHandler(async(req, res)=>{
    
    const { bankName, accountNumber, balance } = req.body;

    if(!bankName || !accountNumber){
        throw new ApiError(400, "Bank name and account number are required")
    }

    const existingAccount = await BankAccount.findOne({
        userId: req.user._id, 
        accountNumber
    });

    if(existingAccount){
        throw new ApiError(400, "Account already exists")
    }

    const bank = await BankAccount.create({
        userId: req.user._id,
        bankName,
        accountNumber,
        balance: balance || 0
    })

    return res
    .status(201)
    .json(new ApiResponse(200, bank,"Bank account added successfully"))

})

const getBankAccounts=asyncHandler(async(req, res)=>{
    
    const banks = await BankAccount.findOne({userId: req.user._id})

    if(!banks){
        throw new ApiError(404, "No bank accounts found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, banks, "Bank accounts found successfully"))
})

const addMoneyToBankAccount = asyncHandler(async(req, res)=>{
    const { bankId, amount} = req.body

    if(!bankId || !amount || amount <= 0){
        throw new ApiError(400, "Invalid bank ID or amount")
    }

    const bank = await BankAccount.findOne({ _id: bankId, userId: req.user._id })

    if(!bank){
        throw new ApiError(404, "Bank account not found")
    }

    bank.balance += amount
    await bank.save()

    return res
    .status(200)
    .json(new ApiResponse(200, bank, "Money added to bank account successfully"))
})

export { addBankAccount, getBankAccounts, addMoneyToBankAccount }