import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  user: string;
  text: string;
  dialog: string;
  _id: string;
}

const MessageSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: "Text is required",
    },
    dialog: {
      type: Schema.Types.ObjectId,
      ref: "Dialog",
    },
    typeMessage: {
      type: String,
      default: "DEFAULT_MESSAGE",
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
