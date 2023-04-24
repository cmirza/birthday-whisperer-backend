import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import CustomError from "../utils/customError";
import { User, IUser } from "../models/User";
import { OTP, IOTP } from "../models/OTP";
import { generateOTP } from "../utils/otpGenerator";
import { sendSMS } from "../utils/smsSender";

const JWT_SECRET = process.env.JWT_SECRET || "";

const otpCache = new Map<string, { otp: string; expires: number }>();

export const requestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ phone });
    const isNewUser = !existingUser;

    // Generate OTP
    const otp = generateOTP(6);
    logger.info(`Generated OTP: ${otp}`);

    // Save OTP to DB with expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes
    const otpEntry = new OTP({ phone, otp, expiresAt });
    await otpEntry.save();
    logger.info("Saved OTP to DB");

    // Send OTP via SMS
    await sendSMS(phone, `Your Birthday Whisperer code is ${otp}`);
    logger.info("Sent OTP via SMS");

    res.status(200).json({ message: "OTP sent", isNewUser });
  } catch (error) {
    logger.error("Error sending OTP:", error);
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res
        .status(400)
        .json({ message: "Phone number and OTP are required" });
    }

    // Find OTP in DB
    const otpEntry = await OTP.findOne({ phone, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (otpEntry.expiresAt < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    // Find user in DB or create new user
    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone });
      await user.save();
      logger.info("A new user has been created");
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Delete used OTP from DB
    await OTP.findByIdAndDelete(otpEntry._id);
    logger.info("Used OTP has been deleted");

    res.status(200).json({ token });
    logger.info("A new JWT has been generated");
  } catch (error) {
    logger.error("Error verifying OTP:", error);
    next(error);
  }
};
