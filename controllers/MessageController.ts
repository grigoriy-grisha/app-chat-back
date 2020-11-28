import express from "express";
import { MessageModel } from "../models/Message";
import { UserModel } from "../models/User";
import socket from "socket.io";
import {req, res} from "../index";

export class MessageController {
  constructor(private io: socket.Server) {}

  create = async () => {
    const { dialog, text } = req.body;
    const author = req.user;

    const message = new MessageModel({ dialog, text, author });
    await message.save();

    await UserModel.findById(author).exec((err, user) => {
      if (err) {
        return res.status(404).json({
          status: "error",
          message: "Dialog not found",
        });
      }
      this.io.emit("SERVER:NEW_MESSAGE", { user, message });
    });

    res.json({ message: "Сообщение создано", messages: message });
  };
}
