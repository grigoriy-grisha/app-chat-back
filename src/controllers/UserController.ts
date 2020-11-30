import { createJWToken } from "../utils/createJWToken";
import { compareSync, hash } from "bcrypt";
import { requestDecorator } from "../requestDecorator";
import { UserModel } from "../models/User";
import { authService } from "../services/AuthService";
import { BaseRequestError } from "../BaseRquestError";
import { dialogService } from "../services/DialogService";

interface RequestInterface {
  body: {
    email: string;
    fullname: string;
    password: string;
  };
  user: string;
}

export class UserController {
  @requestDecorator
  async create({ body: { email, fullname, password } }: RequestInterface) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new BaseRequestError("Такой пользователь уже создан", 400);
    } else {
      const hashedPassword = await hash(password, 12);
      await authService.createUser(email, fullname, hashedPassword);
      return { status: 201, message: "Пользователь создан" };
    }
  }

  @requestDecorator
  async login({ body: { email, password } }: RequestInterface) {
    const userFound = await UserModel.findOne({ email });

    if (!userFound) throw new BaseRequestError("Пользователь не найден", 404);

    if (compareSync(password, userFound.password)) {
      const token = createJWToken(userFound.id);
      return {
        status: 200,
        _id: userFound._id,
        token,
      };
    } else {
      throw new BaseRequestError("Incorrect password or email", 403);
    }
  }
}
