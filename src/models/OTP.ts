import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
    phone: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
}

const otpSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export const OTP = mongoose.model<IOTP>("OTP", otpSchema);
