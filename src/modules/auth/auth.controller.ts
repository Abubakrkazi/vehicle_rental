import { Request, Response } from "express";
import { signupUser, loginUser } from "./auth.service";

/**
 * SIGNUP CONTROLLER
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const user = await signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Signup failed"
     
    });
  }
};

/**
 * SIGNIN CONTROLLER
 */
export const signin = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || "Invalid credentials"
     
    });
  }
};