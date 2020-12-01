import express from "express";
import {dialogService} from "../services/DialogService";

export class LinkController {
  async redirect(req: express.Request, res: express.Response) {
    try {
      const dialog = req.body.dialog
      const author = req.user!
      await dialogService.addUserRedirect(author, dialog)
      res.redirect(`http://localhost:3000/${dialog}`)
    } catch (e) {
      res
        .status(e.statusError ? e.statusError : 500)
        .json({message: e.message});
    }

  }

}
