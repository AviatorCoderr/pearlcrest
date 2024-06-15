import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import flatRouter from './routes/flat.routes.js';
import ownerRouter from './routes/owner.routes.js';
import renterRouter from './routes/renter.routes.js';
import petRouter from './routes/pet.routes.js';
import visitorRouter from './routes/visitor.routes.js';
import vehicleRouter from './routes/vehicle.routes.js';
import accountRouter from './routes/accounts.routes.js';
import paymentRouter from './routes/payment.router.js';
import maidRouter from './routes/maid.routes.js';
import demandRouter from './routes/paydemand.routes.js';
import reviewRouter from './routes/review.routes.js';
import bookingRouter from './routes/facilityreservation.routes.js';
import notificationRouter from './routes/notification.routes.js'; // Add this line
import voteRouter from "./routes/vote.routes.js"
// Routes declaration
app.use('/api/v1/users', flatRouter);
app.use('/api/v1/owners', ownerRouter);
app.use('/api/v1/renters', renterRouter);
app.use('/api/v1/pets', petRouter);
app.use('/api/v1/visitor', visitorRouter);
app.use('/api/v1/vehicle', vehicleRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/maid', maidRouter);
app.use('/api/v1/demand', demandRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/vote', voteRouter)

app.use('/api/v1/getkey', (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

export { app };
