import express from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import vehicleRoutes from "../modules/vehicle/vehicle.route";
import bookingRoutes from "../modules/booking/booking.route";

const router = express.Router();


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/bookings", bookingRoutes);

export default router;