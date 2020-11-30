import {UserModel} from "../models/User";
import express from "express";

export class LinkController {
  async redirect(req: express.Request, res: express.Response) {

    const user = await UserModel.findById(req.user)
    console.log(req.user)
    console.log(req.cookies)
    // res.redirect(`http://localhost:3000/dialog/${user!.dialogs.length}`)

  }

}
