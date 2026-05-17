import pool from "../../config/db";

/**
 * CREATE VEHICLE
 */
export const createVehicle = async (data: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = data;

  const result = await pool.query(
    `INSERT INTO vehicles
     (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status || "available",
    ]
  );

  return result.rows[0];
};

/**
 * GET ALL VEHICLES
 */
export const getVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles");

  if (result.rows.length === 0) {
    return { message: "No vehicles found", data: [] };
  }

  return { message: "Vehicles retrieved successfully", data: result.rows };
};

/**
 * GET VEHICLE BY ID
 */
export const getVehicleById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM vehicles WHERE id=$1",
    [id]
  );

  return result.rows[0];
};

/**
 * UPDATE VEHICLE
 */
export const updateVehicle = async (id: number, payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `UPDATE vehicles SET
      vehicle_name = COALESCE($1, vehicle_name),
      type = COALESCE($2, type),
      registration_number = COALESCE($3, registration_number),
      daily_rent_price = COALESCE($4, daily_rent_price),
      availability_status = COALESCE($5, availability_status)
     WHERE id=$6
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

  return result.rows[0];
};

/**
 * DELETE VEHICLE
 */
export const deleteVehicle = async (id: number) => {
  // 🔒 active booking check
  const active = await pool.query(
    "SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'",
    [id]
  );

  if (active.rows.length > 0) {
    throw new Error("Vehicle has active bookings");
  }

  await pool.query("DELETE FROM vehicles WHERE id=$1", [id]);

  return { message: "Vehicle deleted successfully" };
};