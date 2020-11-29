import {DialogModel} from "../models/Dialog";

class DialogService {
  async addUser(user: string, dialog: string, author: string) {
    const dialogFound = await DialogModel.findById(dialog)

    if (!dialogFound) throw new Error("Диалог не найден")
    if (dialogFound.author !== author) throw new Error("Вы не Можете добавлять пользователей!")
    await dialogFound.users.push(user);
    await dialogFound.save();
  }
}

export const dialogService = new DialogService()