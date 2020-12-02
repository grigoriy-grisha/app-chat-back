import {dialogService} from "../services/DialogService";
import {userService} from "../services/UserService";
import {requestDecorator} from "../requestDecorator";
import {linkService} from "../services/LinkService";
import {RequestInterface} from "../types";
import express from "express";
import {io} from "../index";


interface BodyInterface {
  name: string;
  users: string[]
  dialog: string;
  user: string;
  protect: boolean
}

interface RequestInterfaceParams {
  params: {
    id: string;
  };
}

export class DialogController {
  @requestDecorator
  async createDialog({body: {name, users, protect}, user: author}: RequestInterface<BodyInterface>) {
    const {foundUser, dialog} = await dialogService.addUserToDialog(name, author, protect);
    await userService.addDialogInUser(foundUser, dialog);
    await linkService.createLink(dialog._id);

    if (!users) {
      io.emit("SERVER:DIALOG_CREATED", {
        dialog: dialog,
      });
      return dialog;
    }

    await dialogService.addUsersInDialog(dialog, users)
    await userService.addDialogInUsers(users, dialog)

    io.emit("SERVER:DIALOG_CREATED", {
      dialog: dialog,
    });
    return dialog;
  }

  @requestDecorator
  async getDialogs({user: author}: RequestInterface<{}>) {
    const user = await dialogService.getDialogs(author);
    return user.dialogs
  }

  @requestDecorator
  async getAllDialogs({user: author}: RequestInterface<BodyInterface>) {
    return dialogService.getAll(author);
  }

  @requestDecorator
  async addUserToDialog({body: {user, dialog}, user: author}: RequestInterface<BodyInterface>) {
    await dialogService.addUser(user, dialog, author);
    return {message: "Пользователь добавлен"};
  }

  @requestDecorator
  async getDialogInfo({params: {id}}: RequestInterfaceParams) {
    return await dialogService.findDialogById(id)
  }

  // TODO ДОделать
  // @requestDecorator
  async addUserDialog(req: express.Request, res: express.Response) {
    try {
      const dialog = req.body.dialog
      const author = req.user!

      await dialogService.addUserDialog(author, dialog)

      res.json(dialog)


    } catch (e) {
      res
        .status(e.statusError ? e.statusError : 500)
        .json({message: e.message});
    }
  }
}
