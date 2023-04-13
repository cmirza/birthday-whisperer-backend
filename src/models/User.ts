import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  phone: string;
  contacts: [
    {
      name: string;
      birthdate: Date;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        contacts: [contactSchema],
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
