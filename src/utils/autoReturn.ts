import pool from "../config/db";

/**
 * AUTO RETURN BOOKINGS (OPTIMIZED + SAFE)
 */
const autoReturnBookings = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const now = new Date();

    // 1. find expired bookings
    const result = await client.query(
      `SELECT id, vehicle_id
       FROM bookings
       WHERE status = 'active'
       AND rent_end_date < $1`,
      [now]
    );

    if (result.rows.length === 0) {
      console.log("Auto return: no bookings to process");
      await client.query("COMMIT");
      return;
    }

    const bookingIds = result.rows.map((b) => b.id);
    const vehicleIds = [...new Set(result.rows.map((b) => b.vehicle_id))];

    // 2. bulk update bookings
    await client.query(
      `UPDATE bookings
       SET status = 'returned'
       WHERE id = ANY($1::int[])`,
      [bookingIds]
    );

    // 3. bulk update vehicles
    await client.query(
      `UPDATE vehicles
       SET availability_status = 'available'
       WHERE id = ANY($1::int[])`,
      [vehicleIds]
    );

    await client.query("COMMIT");

    console.log(
      `Auto return executed: ${bookingIds.length} bookings updated`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Auto return error:", err);
  } finally {
    client.release();
  }
};

export default autoReturnBookings;