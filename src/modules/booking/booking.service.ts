import pool from "../../config/db";

/**
 * CREATE BOOKING
 */
export const createBooking = async (data: any) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

    const vehicleRes = await client.query(
      "SELECT * FROM vehicles WHERE id=$1",
      [vehicle_id]
    );

    const vehicle = vehicleRes.rows[0];
    if (!vehicle) throw new Error("Vehicle not found");

    if (vehicle.availability_status !== "available") {
      throw new Error("Vehicle not available");
    }

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    if (end <= start) {
      throw new Error("Invalid date range");
    }

    const overlap = await client.query(
      `SELECT * FROM bookings
       WHERE vehicle_id=$1
       AND status='active'
       AND (
         (rent_start_date <= $2 AND rent_end_date >= $2)
         OR
         (rent_start_date <= $3 AND rent_end_date >= $3)
         OR
         ($2 <= rent_start_date AND $3 >= rent_end_date)
       )`,
      [vehicle_id, rent_start_date, rent_end_date]
    );

    if (overlap.rows.length > 0) {
      throw new Error("Vehicle already booked for these dates");
    }

    const diff = end.getTime() - start.getTime();
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    const total_price = days * Number(vehicle.daily_rent_price);

    const result = await client.query(
      `INSERT INTO bookings
       (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    const booking = result.rows[0];

    await client.query(
      "UPDATE vehicles SET availability_status='booked' WHERE id=$1",
      [vehicle_id]
    );

    await client.query("COMMIT");

    return {
      ...booking,
      vehicle: {
        vehicle_name: vehicle.vehicle_name,
        daily_rent_price: vehicle.daily_rent_price,
      },
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

/**
 * GET BOOKINGS
 */
export const getBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.*, 
        u.name AS customer_name, u.email,
        v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
    `);

    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date,
      rent_end_date: row.rent_end_date,
      total_price: row.total_price,
      status: row.status,
      customer: {
        name: row.customer_name,
        email: row.email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
      },
    }));
  }

  const result = await pool.query(
    `
    SELECT 
      b.*, 
      v.vehicle_name, v.registration_number, v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id=$1
    `,
    [user.id]
  );

  return result.rows.map((row) => ({
    id: row.id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date,
    rent_end_date: row.rent_end_date,
    total_price: row.total_price,
    status: row.status,
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
      type: row.type,
    },
  }));
};

/**
 * UPDATE BOOKING (CANCEL / RETURN)
 */
export const updateBooking = async (
  bookingId: number,
  user: any,
  status: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      "SELECT * FROM bookings WHERE id=$1",
      [bookingId]
    );

    const booking = result.rows[0];
    if (!booking) throw new Error("Booking not found");

    if (status === "cancelled") {
      if (booking.customer_id !== user.id) {
        throw new Error("Unauthorized");
      }

      if (booking.status !== "active") {
        throw new Error("Only active booking can be cancelled");
      }

      await client.query(
        "UPDATE bookings SET status='cancelled' WHERE id=$1",
        [bookingId]
      );

      await client.query(
        "UPDATE vehicles SET availability_status='available' WHERE id=$1",
        [booking.vehicle_id]
      );

      await client.query("COMMIT");

      return { ...booking, status: "cancelled" };
    }

    if (status === "returned") {
      if (user.role !== "admin") {
        throw new Error("Only admin can return booking");
      }

      await client.query(
        "UPDATE bookings SET status='returned' WHERE id=$1",
        [bookingId]
      );

      await client.query(
        "UPDATE vehicles SET availability_status='available' WHERE id=$1",
        [booking.vehicle_id]
      );

      await client.query("COMMIT");

      return {
        ...booking,
        status: "returned",
        vehicle: { availability_status: "available" },
      };
    }

    throw new Error("Invalid status");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};