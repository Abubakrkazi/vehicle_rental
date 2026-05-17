import express from "express";
import auth from "../../middleware/auth";
import role from "../../middleware/role";

import {
  createVehicleController,
  getVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController,
} from "./vehicle.controller";

const router = express.Router();

/**
 * CREATE VEHICLE (ADMIN ONLY)
 */
router.post("/", auth, role("admin"), createVehicleController);

/**
 * GET ALL VEHICLES (PUBLIC)
 */
router.get("/", getVehiclesController);

/**
 * GET SINGLE VEHICLE (PUBLIC)
 */
router.get("/:vehicleId", getVehicleByIdController);

/**
 * UPDATE VEHICLE (ADMIN ONLY)
 */
router.put("/:vehicleId", auth, role("admin"), updateVehicleController);

/**
 * DELETE VEHICLE (ADMIN ONLY)
 */
router.delete("/:vehicleId", auth, role("admin"), deleteVehicleController);

export default router;