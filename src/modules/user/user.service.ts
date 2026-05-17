import pool from "../../config/db";

/**
 * GET ALL USERS
 */
export const getUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role, created_at FROM users"
  );
  return result.rows;
};

/**
 * GET USER BY ID
 */
export const getUserById = async (id: number) => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id=$1",
    [id]
  );

  return result.rows[0];
};

/**
 * UPDATE USER
 */
export const updateUser = async (id: number, payload: any, user: any) => {
  // 🔒 permission check (admin OR self)
  if (user.role !== "admin" && user.id !== id) {
    throw new Error("Forbidden");
  }

  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users
     SET 
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = CASE WHEN $4 IS NOT NULL AND $5 = 'admin' THEN $4 ELSE role END
     WHERE id=$5
     RETURNING id, name, email, phone, role`,
    [
      name,
      email?.toLowerCase(),
      phone,
      role,
      user.role,
      id,
    ]
  );

  return result.rows[0];
};

/**
 * DELETE USER
 */
export const deleteUser = async (id: number) => {
  // 🔒 check active bookings
  const active = await pool.query(
    "SELECT * FROM bookings WHERE customer_id=$1 AND status='active'",
    [id]
  );

  if (active.rows.length > 0) {
    throw new Error("User has active bookings");
  }

  await pool.query("DELETE FROM users WHERE id=$1", [id]);

  return { message: "User deleted successfully" };
};