import mongoose, { Schema, Document } from "mongoose";

export interface IUserContacts extends Array<IContact> {
  id: (contactID: string | number | undefined) => IContact | null;
}

export interface IContact extends Document {
  name: string;
  birthdate: Date;
}

export interface IUser extends Document {
  phone: string;
  contacts: IUserContacts;
  timezone: string;
  reminderTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    },
    name: {
      type: String,
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true
    },
    contacts: [contactSchema],
    timezone: {
      type: String,
      required: true
    },
    reminderTime: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
export const Contact = mongoose.model<IContact>("Contact", contactSchema);
