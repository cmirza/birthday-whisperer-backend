import mongoose, { Schema, Document } from "mongoose";

export interface IUserContacts extends Array<IContact> {
  id: (contactID: string | number | undefined) => IContact | null;
}

export interface IContact extends Document {
  name: string;
  birthdate: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  phone: string;
  contacts: IUserContacts;
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

export const User = mongoose.model<IUser>("User", userSchema);
export const Contact = mongoose.model<IContact>("Contact", contactSchema);
