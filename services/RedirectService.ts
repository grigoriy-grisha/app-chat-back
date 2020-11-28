import {req, res} from "../index";
import {LinkModel} from "../models/Link";
import {DialogModel} from "../models/Dialog";
import {UserModel} from "../models/User";
import config from "config"

class RedirectService {
  async redirect(dialogId: string) {

    const link = await LinkModel.findOne({dialog: dialogId})
    const user = await UserModel.findById(req.user)

    if (!link) res.status(404).json('Ссылка не найдена')

    return res.redirect(convertUrl(user!.dialogs.length))

  }
}

function convertUrl(index: number) {
  return `${config.get("baseUrl")}/dialog/${index}`
}

export const redirectService = new RedirectService()