import express from "express";
import {
  requestOTP,
  verifyOTP,
  getUserSettings,
  updateUserSettings,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.get("/settings", authMiddleware, getUserSettings);
router.patch("/settings", authMiddleware, updateUserSettings);

export default router;
