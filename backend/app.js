import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.use(cors({
    origin:"*"
}))//read cors from the documents 
app.use(cookieParser())

app.use(express.json({limit: "10mb"}))//read about it
app.use(express.urlencoded({limit: "10mb", extended: true}))//read about it 
app.use(express.static("public"))//read about it

//routes import
import userRouter from "./routes/user.route.js"

//router declaration
app.use("/api/v1/users", userRouter)

export { app }