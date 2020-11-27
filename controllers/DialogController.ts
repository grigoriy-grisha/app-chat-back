import express from "express";
import { DialogModel } from "../models/Dialog";
import { UserModel } from "../models/User";

export class DialogController {
  create = async (req: express.Request, res: express.Response) => {
    const { name } = req.body;
    const author = req.user!;

    const dialog = await new DialogModel({ name, author });
    await dialog.users.push(author);
    await dialog.save();

    const user = await UserModel.findById(author);
    await user!.dialogs.push(dialog._id);
    await user!.save();

    res.json(dialog);
  };


  getDialogs = async (req: express.Request, res: express.Response) => {
    const author = req.user!;

    await UserModel.findById(author)
      .populate("dialogs")
      .exec((err, user) => {
        if (err) {
          return res.status(404).json({
            status: "error",
            message: "Dialog not found"
          });
        }

        res.json(user);
      });
  };
}
