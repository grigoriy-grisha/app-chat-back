import { redirectService } from "../services/RedirectService";
import express from "express";

export class RedirectController {
  async redirect(req: express.Request, res: express.Response) {
    try {
      const dialogId = req.params.id;
      const redirectUrl = await redirectService.redirect(dialogId);
      res.redirect(redirectUrl);
    } catch (e) {
      res
        .status(e.statusError ? e.statusError : 500)
        .json({ message: e.message });
    }
  }
}
