import {req, res} from "../index";
import {redirectService} from "../services/RedirectService";

export class RedirectController {
  async redirect() {
    try {
      const dialogId = req.params.id
      console.log(dialogId)
      await redirectService.redirect(dialogId)

    } catch (e) {
      res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }

  }
}