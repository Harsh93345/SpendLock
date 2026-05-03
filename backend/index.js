import "./load-env.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const port = process.env.PORT || 8000;

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on port ${port}`)
    })
})
.catch((error)=>{
    console.log("DB CONNECTION ERROR: ",error)
})
