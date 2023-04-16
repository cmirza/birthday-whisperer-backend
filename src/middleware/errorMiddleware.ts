import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Server error" });
};

export default errorMiddleware;
