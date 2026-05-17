import { Request, Response } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "./vehicle.service";

/**
 * CREATE VEHICLE
 */
export const createVehicleController = async (req: Request, res: Response) => {
  try {
    const vehicle = await createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

/**
 * GET ALL VEHICLES
 */
export const getVehiclesController = async (req: Request, res: Response) => {
  try {
    const result = await getVehicles();

    res.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

/**
 * GET VEHICLE BY ID
 */
export const getVehicleByIdController = async (req: Request, res: Response) => {
  try {
    const vehicle = await getVehicleById(Number(req.params.vehicleId));

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        errors: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

/**
 * UPDATE VEHICLE
 */
export const updateVehicleController = async (req: Request, res: Response) => {
  try {
    const updated = await updateVehicle(
      Number(req.params.vehicleId),
      req.body
    );

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: updated,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

/**
 * DELETE VEHICLE
 */
export const deleteVehicleController = async (req: Request, res: Response) => {
  try {
    const result = await deleteVehicle(Number(req.params.vehicleId));

    res.json({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};