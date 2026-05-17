import express from "express";
import auth from "../../middleware/auth";
import role from "../../middleware/role";

import {
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./user.controller";

const router = express.Router();

/**
 * ADMIN ONLY
 */
router.get("/", auth, role("admin"), getUsersController);

/**
 * GET SINGLE USER (ADMIN)
 */
router.get("/:id", auth, role("admin"), getUserByIdController);

/**
 * UPDATE USER (ADMIN OR SELF)
 */
router.put("/:id", auth, updateUserController);

/**
 * DELETE USER (ADMIN ONLY)
 */
router.delete("/:id", auth, role("admin"), deleteUserController);

export default router;