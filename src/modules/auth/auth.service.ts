import pool from "../../config/db";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt";

/**
 * SIGNUP USER
 */
export const signupUser = async (payload: any) => {
  const { name, email, password, phone } = payload;

  // 🔒 check existing user
  const existing = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email.toLowerCase()]
  );

  if (existing.rows.length > 0) {
    throw new Error("User already exists");
  }

  // 🔒 hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🔒 force role (security)
  const role = "customer";

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

/**
 * LOGIN USER
 */
export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email.toLowerCase()]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  // 🔐 generate JWT
  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};