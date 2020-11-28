import { createJWToken } from "./../utils/createJWToken";
import { IUser } from "./../models/User";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { UserModel } from "../models/User";
import {req, res} from "../index";

export class UserController {
  create = async () => {
    const { email, fullname, password } = req.body;

    const errors = validationResult(req);
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      res.status(400).json({ message: "Такаой Пользователь уже создан" });
    } else if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel({
        email,
        fullname,
        password: hashedPassword,
      });
      await user.save();

      res.json({ message: "Пользователь создан" });
    }
  };
  login = (): void => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(422).json({ errors: errors.array() });

    UserModel.findOne({ email }, (err: any, user: IUser) => {
      if (err || !user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = createJWToken(user.id);
        res.json({
          status: "success",
          _id: user._id,
          token,
        });
      } else {
        res.status(403).json({
          status: "error",
          message: "Incorrect password or email",
        });
      }
    });
  };
}
