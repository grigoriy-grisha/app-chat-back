import {req, res} from "../index";
import {LinkModel} from "../models/Link"
import config from "config"
import {DialogModel} from "../models/Dialog";

class LinkService {

  async create(dialogId: string) {
    try {
      const baseUrl = config.get("baseUrl")
      const existing = await LinkModel.findOne({dialog: dialogId})

      if (existing) return res.json({link: existing})

      const url = baseUrl + '/append/' + dialogId
      const link = new LinkModel({
        url, dialog: dialogId
      })
      await link.save()

      const dialog = await DialogModel.findByIdAndUpdate(dialogId, {link: link._id}, {new: true})

      if (!dialog) throw Error()

      await dialog.save()
    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
  }
}

export const linkService = new LinkService()