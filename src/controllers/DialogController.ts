import { DialogModel } from "../models/Dialog";
import { UserModel } from "../models/User";
import { dialogService } from "../services/DialogService";
import { userService } from "../services/UserService";
import { requestDecorator } from "../requestDecorator";
import { linkService } from "../services/LinkService";
import { BaseRequestError } from "../BaseRquestError";

interface RequestInterface {
  body: {
    name: string;
    dialog: string;
    user: string;
  };
  user: string;
}

export class DialogController {
  @requestDecorator
  async create({ body: { name }, user: author }: RequestInterface) {
    const dialog = await new DialogModel({ name, author });
    await dialogService.addUserInDialog(dialog, author);

    const user = await UserModel.findById(author);
    if (!user) throw new BaseRequestError("User Not found", 404);

    await userService.addDialogInUser(user, dialog);

    await linkService.createLink(dialog._id);
    return { status: 200, dialog };
  }

  @requestDecorator
  async getDialogs({ user: author }: RequestInterface) {
    const user = await dialogService.getDialogs(author);
    if (!user) throw new BaseRequestError("User Not found", 404);
    return { status: 200, dialogs: user.dialogs };
  }

  async getAll() {
    return dialogService.getAll();
  }

  @requestDecorator
  async addUser({ body: { user, dialog }, user: author }: RequestInterface) {
    await dialogService.addUser(user, dialog, author);

    return { status: 200, message: "Пользователь добавлен" };
  }
}
