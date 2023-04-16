import { Request, Response, NextFunction } from "express";
import { objectIdValidator } from "../validators/objectIdValidator";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const { error } = objectIdValidator.validate(id);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
};
