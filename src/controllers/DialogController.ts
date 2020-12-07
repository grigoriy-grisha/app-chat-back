import { dialogService } from "../services/DialogService";
import { userService } from "../services/UserService";
import { requestDecorator } from "../requestDecorator";
import { RequestInterface } from "../types";

interface BodyInterface {
  name: string;
  users: string[];
  dialog: string;
  user: string;
  protect: boolean;
}

interface RequestInterfaceParams {
  params: {
    id: string;
  };
}

export class DialogController {
  @requestDecorator
  async createDialog({
    body: { name, users, protect },
    user: author,
  }: RequestInterface<BodyInterface>) {
    const { foundUser, dialog } = await dialogService.addUserToDialog(
      name,
      author,
      protect
    );

    await userService.addDialogInUser(foundUser, dialog);
    await dialogService.addUsersInDialog(dialog, users);
    await userService.addDialogInUsers(users, dialog);

    return dialog;
  }

  @requestDecorator
  async getDialogs({ user: author }: RequestInterface<{}>) {
    const user = await dialogService.getDialogs(author);
    return user.dialogs;
  }

  @requestDecorator
  async getAllDialogs({ user: author }: RequestInterface<BodyInterface>) {
    return dialogService.getAll(author);
  }

  @requestDecorator
  async addUserToDialog({
    body: { user, dialog },
    user: author,
  }: RequestInterface<BodyInterface>) {
    await dialogService.addUser(user, dialog, author);
    return { message: "Пользователь добавлен" };
  }

  @requestDecorator
  async getDialogInfo({
    params: { id },
    user: author,
  }: RequestInterface<{}> & RequestInterfaceParams) {
    return dialogService.addUserDialog(author, id);
  }

  @requestDecorator
  async addUserDialog({
    body: { dialog },
    user: author,
  }: RequestInterface<BodyInterface>) {
    await dialogService.addUserDialog(author, dialog);
    return dialog;
  }
}
