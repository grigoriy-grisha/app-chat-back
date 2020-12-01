import {DialogModel, IDialog} from "../models/Dialog";
import {UserModel} from "../models/User";
import {BaseRequestError} from "../BaseRquestError";
import {userService} from "./UserService";

class DialogService {
  async addUser(user: string, dialog: string, author: string) {
    const dialogFound = await this.findDialogById(dialog)
    if (dialogFound.author === author)
      throw new BaseRequestError("Вы не Можете добавлять пользователей!", 403);

    this.checkAddedUser(dialogFound, user)

    await dialogFound.users.push(user);
    await dialogFound.save();

    const foundUser = await userService.isThereUser(user)
    await userService.addDialogInUser(foundUser, dialogFound);
  }

  async getDialogs(author: string) {
    const user = await UserModel.findById(author).populate("dialogs");
    if (!user) throw new BaseRequestError("User Not found", 404);
    return user;
  }

  async getAll() {
    const dialogs = await DialogModel.find({});
    return {status: 200, dialogs};
  }

  async addUserToDialog(name: string, author: string) {
    const dialog = await new DialogModel({name, author});
    await dialog.users.push(author);
    await dialog.save();

    const foundUser = await userService.isThereUser(author)

    return {foundUser, dialog}
  }


  async addUserRedirect(user: string, dialog: string) {
    const dialogFound = await this.findDialogById(dialog)
    this.checkAddedUser(dialogFound, user)

    await dialogFound.users.push(user);
    await dialogFound.save();

    const foundUser = await userService.isThereUser(user)
    await userService.addDialogInUser(foundUser, dialogFound);
  }

  async findDialogById(id: string) {
    const dialogFound = await DialogModel.findById(id);

    if (!dialogFound) throw new BaseRequestError("Диалог не найден", 404);
    return dialogFound
  }

  checkAddedUser(dialog: IDialog, user: string) {
    const userFound = dialog.users.find((item: string) => {
      if (item.toString() === user.toString()) return true;
    });
    if (userFound) throw new BaseRequestError("Пользователь уже добавлен", 403);

  }

}

export const dialogService = new DialogService();
