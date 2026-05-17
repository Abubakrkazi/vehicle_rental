import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err.message,
  });
};

export default globalErrorHandler;