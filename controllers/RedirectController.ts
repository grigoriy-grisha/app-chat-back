import {req, res} from "../index";
import {redirectService} from "../services/RedirectService";

export class RedirectController {
  async redirect() {

      const dialogId = req.params.id

      await redirectService.redirect(dialogId)



  }
}