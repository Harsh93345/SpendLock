import express from "express";
import dotenv from "dotenv";

const app = express();
const port = 3000;

app.get("/",(req,res)=>{
    res.send("hello world!")
})

app.listen(port,()=> {
    console.log(`Server is running on port ${port}`);
})