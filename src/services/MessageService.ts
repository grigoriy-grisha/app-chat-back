import { MessageModel } from "../models/Message";
import { UserModel } from "../models/User";
import { DialogModel } from "../models/Dialog";
import { BaseRequestError } from "../BaseRquestError";
import { io } from "../index";

interface IMessageServiceCreate {
  dialog: string;
  text: string;
  author: string;
}

class MessageService {
  async create({ author, dialog, text }: IMessageServiceCreate) {
    const message = new MessageModel({ dialog, text, author });
    await message.save();

    const user = await UserModel.findById(author);
    if (!user) throw new BaseRequestError("Пользователь не найден!", 403);

    io.emit("SERVER:NEW_MESSAGE", { user, message });

    return {
      status: 200,
      message: "Сообщение создано",
      messages: message,
    };
  }

  async checkDialogsUser(dialog: string, author: string) {
    const dialogFound = await DialogModel.findById(dialog);
    const userFound = dialogFound!.users.find((userId: string) => {
      return userId.toString() === author.toString();
    });
    return userFound;
  }

  async getMessage(dialogId: string, author: string) {
    const dialogFound = await DialogModel.findById(dialogId);
    if (!dialogFound) throw new BaseRequestError("Диалог не найден", 404);
    const userFound = await UserModel.findById(author);

    if (!userFound) throw new BaseRequestError("Пользователь не найден", 404);
    const dialogIndex = userFound.dialogs.findIndex((dialog: string, index) => {
      return dialog.toString() === dialogId.toString();
    });
    const messages = await MessageModel.find({ dialog: dialogId }).populate([
      "dialog",
      "user",
      "attachments",
    ]);

    return {
      status: 200,
      message: "Сообщения получены",
      messages,
      index: dialogIndex,
    };
  }
}

export const messageService = new MessageService();
