import { DialogModel, IDialog } from "../models/Dialog";
import { UserModel } from "../models/User";
import { BaseRequestError } from "../BaseRquestError";
import { userService } from "./UserService";

class DialogService {
  async addUser(user: string, dialog: string, author: string) {
    const dialogFound = await DialogModel.findById(dialog);

    if (!dialogFound) throw new BaseRequestError("Диалог не найден", 404);
    if (dialogFound.author === author)
      throw new BaseRequestError("Вы не Можете добавлять пользователей!", 403);

    const userFound = dialogFound.users.find((item: string) => {
      if (item.toString() === user.toString()) return true;
    });
    if (userFound) throw new BaseRequestError("Пользователь уже добавлен", 403);

    await dialogFound.users.push(user);
    await dialogFound.save();

    const foundUser = await UserModel.findById(user);
    if (!foundUser) throw new BaseRequestError("User Not found", 404);
    await userService.addDialogInUser(foundUser, dialogFound);
  }

  async getDialogs(author: string) {
    const user = await UserModel.findById(author).populate("dialogs");
    return user;
  }

  async getAll() {
    const dialogs = await DialogModel.find({});
    return { status: 200, dialogs };
  }

  async addUserInDialog(dialog: IDialog, author: string) {
    await dialog.users.push(author);
    await dialog.save();
  }
}

export const dialogService = new DialogService();
