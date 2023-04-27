import { Request, Response, NextFunction } from "express";
import { sendSMS } from "../utils/smsSender";

export const sendTestSMS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { testKey, phone } = req.params;

    if (!phone || !testKey) {
      return res.status(401).json({ message: "Phone and key are required" });
    }

    const actualKey = process.env.TEST_KEY;

    if (testKey !== actualKey) {
      return res.status(403).json({ message: "Invalid key" });
    }

    const message = "This is a test message from Birthday Whisperer";
    await sendSMS(phone, message);
    res.status(200).json({ message: "Test message sent" });
  } catch (error) {
    next(error);
  }
};
