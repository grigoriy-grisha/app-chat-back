import express from "express";
import { DialogModel } from "../models/Dialog";
import { UserModel } from "../models/User";
import {req, res} from "../index";
import {linkService} from "../services/LinkService";

export class DialogController {
  create = async () => {
    const { name } = req.body;
    const author: any = req.user!;

    const dialog = await new DialogModel({ name, author });
    await dialog.users.push(author);
    await dialog.save();

    const user = await UserModel.findById(author);
    await user!.dialogs.push(dialog._id);
    await user!.save();

    await linkService.create(dialog._id)

    res.json({dialog});
  };


  getDialogs = async () => {
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
