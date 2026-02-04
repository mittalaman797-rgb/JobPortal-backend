import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./modals/db.js";
import userRoutes from "./routes/authRoutes.js"
import companyRoutes from "./routes/companyRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicantRoutes from "./routes/applicationRoutes.js"
dotenv.config()

const app = express()


//  MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const corsOptions = {
     origin: "*",
     credentials: true
}
app.use(cors())
    

     //  API

app.use("/auth",userRoutes)
app.use("/company",companyRoutes)
app.use("/job",jobRoutes)
app.use("/application",applicantRoutes)


const PORT = process.env.PORT || 5000
const fnc = async () => {
     try {
          await connectDB()
          app.listen(PORT, () => {
               console.log("server started")
          })

     } catch (err) {
          console.log("somthing error", err)
     }

}
fnc()


