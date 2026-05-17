import { Request, Response } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.service";

/**
 * GET ALL USERS (ADMIN)
 */
export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
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
 * GET USER BY ID
 */
export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(Number(req.params.id));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User retrieved successfully",
      data: user,
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
 * UPDATE USER
 */
export const updateUserController = async (req: any, res: Response) => {
  try {
    const updated = await updateUser(
      Number(req.params.id),
      req.body,
      req.user
    );

    res.json({
      success: true,
      message: "User updated successfully",
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
 * DELETE USER
 */
export const deleteUserController = async (req: any, res: Response) => {
  try {
    const result = await deleteUser(Number(req.params.id));

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