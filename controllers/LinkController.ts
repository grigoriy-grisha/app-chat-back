import {UserModel} from "../models/User";
import {req, res} from "../index";

export class LinkController {
  async redirect() {

    const user = await UserModel.findById(req.user)
    console.log(req.user)
    console.log(req.cookies)
    // res.redirect(`http://localhost:3000/dialog/${user!.dialogs.length}`)

  }

}