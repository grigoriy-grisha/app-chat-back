import mongoose, { Schema, Document} from "mongoose";


export interface ILink extends Document {
  url: string
  date: Date
  dialog: string
}

const LinkSchema = new Schema({
  url: {type: String, required: true, unique: true},
  date: {type: Date, default: Date.now},
  dialog: {type: Schema.Types.ObjectId, ref: 'Dialog'}
})

export const LinkModel = mongoose.model<ILink>("Link", LinkSchema);


