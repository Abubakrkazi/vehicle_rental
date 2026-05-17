import {
  createBooking,
  getBookings,
  updateBooking,
} from "./booking.service";

export const createBookingController = async (req: any, res: any) => {
  try {
    const booking = await createBooking({
      ...req.body,
      customer_id: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

export const getBookingsController = async (req: any, res: any) => {
  try {
    const data = await getBookings(req.user);

    res.json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

export const updateBookingController = async (req: any, res: any) => {
  try {
    const result = await updateBooking(
      Number(req.params.bookingId),
      req.user,
      req.body.status
    );

    res.json({
      success: true,
      message:
        req.body.status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};