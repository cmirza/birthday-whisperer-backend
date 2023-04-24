import { OTP } from "../models/OTP";
import logger from "../utils/logger";
import cron from "node-cron";

const cleanupExpiredOTPs = async () => {
  const now = new Date();
  logger.info("Cleaning up expired OTPs at", now.toISOString());

  try {
    const result = await OTP.deleteMany({ expiresAt: { $lt: now } });
    logger.info(`Deleted ${result.deletedCount} expired OTPs`);
  } catch (error) {
    logger.error("Error while cleaning up expired OTPs:", error);
  }
};

// Cleanup unused OTPs at 12:00AM, daily
cron.schedule("0 0 * * *", cleanupExpiredOTPs);
