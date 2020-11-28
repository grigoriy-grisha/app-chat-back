import mongoose, {Schema, Document} from "mongoose";


export interface IDialog extends Document {
  name: string
  _id: string
  users: string[]
  author: string
}

const DialogSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: "Name is required"
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    link: {
      type: Schema.Types.ObjectId,
      ref: "Link"
    },
    lastMessage: {type: String},
    protected: {type: Boolean},
  },
  {
    timestamps: true
  }
);

export const DialogModel = mongoose.model<IDialog>("Dialog", DialogSchema);

