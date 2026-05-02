import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createWallet,
    addMoneyToWallet,
    getWallet
} from "../controllers/wallet.controller.js";

const walletRouter = Router();

walletRouter.route("/create").post(verifyJWT, createWallet);

walletRouter.route("/add-money").post(verifyJWT, addMoneyToWallet);

walletRouter.route("/").get(verifyJWT, getWallet);

export default walletRouter;