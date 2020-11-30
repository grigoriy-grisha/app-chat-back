import mongoose, { Schema, Document } from "mongoose";
import { isEmail } from "validator";


export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  _id: string
  dialogs: string[]
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      require: "Email address is required",
      validate: [isEmail, "Invalid email"],
    },
    fullname: {
      type: String,
      required: "Fullname is required",
    },
    password: {
      type: String,
      required: "Password is required",
    },
    dialogs: [{
      type: Schema.Types.ObjectId,
      ref: "Dialog"
    }]
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);

