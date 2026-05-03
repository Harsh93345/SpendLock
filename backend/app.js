import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:"*"
}))
app.use(cookieParser())

app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({limit: "10mb", extended: true}))
app.use(express.static("public"))


import userRouter from "./routes/user.route.js"
import walletRouter from "./routes/wallets.route.js"
import bankRouter from "./routes/bank.route.js"
import budgetRouter from "./routes/budget.route.js"
import categoryRouter from "./routes/category.route.js"
import transactionRouter from "./routes/transaction.route.js"
import dashboardRouter from "./routes/dashboard.route.js"


app.use("/api/v1/users", userRouter)
app.use("/api/v1/wallets", walletRouter)
app.use("/api/v1/banks", bankRouter)
app.use("/api/v1/budget", budgetRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/transaction", transactionRouter)
app.use("/api/v1/dashboard", dashboardRouter)


export { app }