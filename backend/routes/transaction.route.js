import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    makePayment,
    getTransactions,
    getTransactionsByCategory
} from "../controllers/transaction.controller.js";

const transactionRouter = Router();

transactionRouter.route("/pay").post(verifyJWT, makePayment);

transactionRouter.route("/").get(verifyJWT, getTransactions);

transactionRouter.route("/category/:categoryId").get(verifyJWT, getTransactionsByCategory);

export default transactionRouter;