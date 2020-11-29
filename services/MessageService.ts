import {MessageModel} from "../models/Message";
import {req, res} from "../index";
import {IUser, UserModel} from "../models/User";
import socket from "socket.io";
import {DialogModel} from "../models/Dialog";

interface IMessageServiceCreate {
  dialog: string,
  text: string,
  author: string
  io: socket.Server
}

class MessageService {
  async create({author, dialog, text, io}: IMessageServiceCreate) {

    const message = new MessageModel({dialog, text, author});
    await message.save();

    await UserModel.findById(author).exec((err, user) => {
      if (err) {
        return res.status(404).json({
          status: "error",
          message: "Dialog not found",
        });
      }
      io.emit("SERVER:NEW_MESSAGE", {user, message});
    });

    res.json({message: "Сообщение создано", messages: message});
  }

  async checkDialogsUser(dialog: string, author: string) {
      const dialogFound = await DialogModel.findById(dialog)

      const userFound = dialogFound!.users.find((userId: string) => {
        return userId === author;
      })
      return userFound
  }

  async getMessage(dialogId: string) {
    await MessageModel.find({dialog: dialogId})
      .populate(["dialog", "user", "attachments"])
      .exec(function (err, messages) {
        if (err) {
          return res.status(404).json({
            status: "error",
            message: "Messages not found",
          });
        }
        res.json(messages);
      });
  }
}

export const messageService = new MessageService()