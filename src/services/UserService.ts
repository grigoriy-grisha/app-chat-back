import {IUser, UserModel} from "../models/User";
import {DialogModel, IDialog} from "../models/Dialog";
import {BaseRequestError} from "../BaseRquestError";

class UserService {
  async addDialogInUser(user: IUser, dialog: IDialog) {
    await user.dialogs.push(dialog._id);
    await user.save();
  }

  async addDialogInUsers(users: string[], dialog: IDialog) {
    users.map(async (item) => {
      const user = await UserModel.findById(item)
      if (!user) return
      await user.dialogs.push(dialog._id);
      await user.save();
    })

  }

  async isThereUser(user: string) {
    const foundUser = await UserModel.findById(user);
    if (!foundUser) throw new BaseRequestError("User Not found", 404);
    return foundUser
  }

  async getAll() {
    const users = await UserModel.find({});
    return {status: 200, users};
  }
}

export const userService = new UserService();
