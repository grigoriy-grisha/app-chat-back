import { LinkModel } from "../models/Link";
import config from "config";
import { DialogModel } from "../models/Dialog";
import { BaseRequestError } from "../BaseRquestError";

class LinkService {
  async createLink(dialogId: string) {
    const baseUrl = config.get("baseUrl");
    const existing = await LinkModel.findOne({ dialog: dialogId });

    if (existing) return { link: existing };

    const url = baseUrl + "/append/" + dialogId;
    const link = new LinkModel({
      url,
      dialog: dialogId,
    });
    await link.save();

    const dialog = await DialogModel.findByIdAndUpdate(
      dialogId,
      { link: link._id },
      { new: true }
    );

    if (!dialog) throw new BaseRequestError("Dialog Not found", 404);
    await dialog.save();
  }
}

export const linkService = new LinkService();
