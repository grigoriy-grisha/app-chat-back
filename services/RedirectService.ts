import {req, res} from "../index";
import {LinkModel} from "../models/Link";
import config from "config"

class RedirectService {
  async redirect(dialogId: string) {

    const link = await LinkModel.findOne({dialog: dialogId})
    if (!link) {
      res.status(404).json('Ссылка не найдена')
    } else {
      console.log(req.cookies)
      res.cookie('token', '12345ABCDE')
      res.redirect(`http://localhost:3000/dialog/`)
    }
  }
}



export const redirectService = new RedirectService()