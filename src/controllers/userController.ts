import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from '../utils/logger';
import CustomError from "../utils/customError";
import { User, IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is in use
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: IUser = new User({
      email,
      password: hashedPassword,
      phone,
    });

    // Save new user to DB
    await newUser.save();
    logger.info('A new user has been registered');

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    logger.info('A new login token has been created');

    res.status(201).json({ token });
  } catch (error) {
    logger.error('Error occurred while registering a user', error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token });
    logger.info('A new login token has been created');
  } catch (error) {
    logger.error('Error occurred while issuing a login token', error);
    next(error);
  }
};
