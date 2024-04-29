import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import flatRouter from "./routes/flat.routes.js"
import ownerRouter from "./routes/owner.routes.js"
import renterRouter from "./routes/renter.routes.js"
import petRouter from "./routes/pet.routes.js"
import visitorRouter from "./routes/visitor.routes.js"
import vehicleRouter from "./routes/vehicle.routes.js"
import accountRouter from "./routes/accounts.routes.js"
import paymentRouter from "./routes/payment.router.js"
// routes declaration
app.use("/api/v1/users", flatRouter)
app.use("/api/v1/owners", ownerRouter)
app.use("/api/v1/renters", renterRouter)
app.use("/api/v1/pets", petRouter)
app.use("/api/v1/visitor", visitorRouter)
app.use("/api/v1/vehicle", vehicleRouter)
app.use("/api/v1/account", accountRouter)
app.use("/api/v1/payment", paymentRouter)
app.use("/api/v1/getkey", (req, res) =>
    res.status(200).json({key: process.env.RAZORPAY_API_KEY})
)
//http:localhost:8000/api/v1/users/register
export { app }
