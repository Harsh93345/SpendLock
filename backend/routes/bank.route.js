import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    addBankAccount,
    getBankAccounts,
    addMoneyToBankAccount
} from "../controllers/bank.controller.js";

const bankRouter = Router();

bankRouter.route("/add").post(verifyJWT, addBankAccount);
bankRouter.route("/").get(verifyJWT, getBankAccounts);
bankRouter.route("/add-money").post(verifyJWT, addMoneyToBankAccount);

export default bankRouter;