import {IUser, UserModel} from "../models/User";
import {IDialog} from "../models/Dialog";
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

  async getAll(author: string) {
    const users = await UserModel.find({_id: {$ne: author}});
    return {status: 200, users};
  }


  async changePassword(author: string, hashedPassword: string) {
    const user = await UserModel.findById(author)
    if (!user) throw new BaseRequestError("Что-то пошло не так!", 500)
    user.password = hashedPassword
    user.save()
    return {message: "Пароль изменен"}
  }
}

export const userService = new UserService();
