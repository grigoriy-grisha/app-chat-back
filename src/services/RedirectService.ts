import { LinkModel } from "../models/Link";
import config from "config";
import { BaseRequestError } from "../BaseRquestError";


class RedirectService {
  async redirect(dialogId: string) {
    const link = await LinkModel.findOne({ dialog: dialogId });
    console.log(link)
    if (!link) {
      throw new BaseRequestError("Ссылка не найдена", 404);
    } else {
      return config.get("clientUrl") + "/redirect";
    }
  }
}

export const redirectService = new RedirectService();
