import express from "express";
import auth from "../../middleware/auth";
import {
  createBookingController,
  getBookingsController,
  updateBookingController,
} from "./booking.controller";

const router = express.Router();

router.post("/", auth, createBookingController);
router.get("/", auth, getBookingsController);
router.put("/:bookingId", auth, updateBookingController);

export default router;