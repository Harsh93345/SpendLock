import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createBudget,
    getActiveBudget
} from "../controllers/budget.controller.js";

const budgetRouter = Router();

budgetRouter.route("/create").post(verifyJWT, createBudget);

budgetRouter.route("/active").get(verifyJWT, getActiveBudget);

export default budgetRouter;