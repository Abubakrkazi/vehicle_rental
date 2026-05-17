import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import pool from "./config/db";
import autoReturnBookings from "./utils/autoReturn";

const PORT = process.env.PORT || 5000;

/**
 * ROOT ROUTE
 */
app.get("/", (req, res) => {
  res.send("Vehicle Rental API is running 🚀");
});

/**
 * TEST DB CONNECTION
 */
app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({
    success: true,
    time: result.rows[0],
  });
});

/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // 🔥 Auto return scheduler
  setInterval(() => {
    autoReturnBookings();
  }, 60 * 1000);
});

export default app;