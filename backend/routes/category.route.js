import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createCategory,
    getCategories
} from "../controllers/category.controller.js";

const categoryRouter = Router();

categoryRouter.route("/create").post(verifyJWT, createCategory);

categoryRouter.route("/").get(verifyJWT, getCategories);

export default categoryRouter;