import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

export interface IAuthRequest extends Request {
  user: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authMiddleware = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Malformed token" });
    }

    const { id } = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication error" });
  }
};
