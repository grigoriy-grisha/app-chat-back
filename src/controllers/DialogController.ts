import {dialogService} from "../services/DialogService";
import {userService} from "../services/UserService";
import {requestDecorator} from "../requestDecorator";
import {linkService} from "../services/LinkService";
import {RequestInterface} from "../types";


interface BodyInterface {
  name: string;
  dialog: string;
  user: string;
}

export class DialogController {
  @requestDecorator
  async createDialog({body: {name}, user: author}: RequestInterface<BodyInterface>) {
    const {foundUser, dialog} = await dialogService.addUserToDialog(name, author);
    await userService.addDialogInUser(foundUser, dialog);
    await linkService.createLink(dialog._id);
    return dialog;
  }

  @requestDecorator
  async getDialogs({user: author}: RequestInterface<{}>) {
    const user = await dialogService.getDialogs(author);
    return user.dialogs
  }

  @requestDecorator
  async getAllDialogs() {
    return dialogService.getAll();
  }

  @requestDecorator
  async addUserToDialog({body: {user, dialog}, user: author}: RequestInterface<BodyInterface>) {
    await dialogService.addUser(user, dialog, author);
    return {message: "Пользователь добавлен"};
  }
}
