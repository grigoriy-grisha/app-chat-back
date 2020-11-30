import { IUser } from "../models/User";
import { IDialog } from "../models/Dialog";

class UserService {
  async addDialogInUser(user: IUser, dialog: IDialog) {
    await user.dialogs.push(dialog._id);
    await user.save();
  }
}

export const userService = new UserService();
