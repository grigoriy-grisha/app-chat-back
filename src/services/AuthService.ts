import {UserModel} from "../models/User";
import {BaseRequestError} from "../BaseRquestError";
import {compareSync} from "bcrypt";
import {createJWToken} from "../utils/createJWToken";

class AuthService {
  async createUser(email: string, fullname: string, hashedPassword: string) {
    const user = new UserModel({
      email,
      fullname,
      password: hashedPassword,
    });
    await user.save();
  }

  async checkUserByEmail(email: string) {
    const candidate = await UserModel.findOne({email});

    if (candidate)
      throw new BaseRequestError("Такой пользователь уже создан", 400);
  }

  async checkPasswordUser(password: string, email: string) {
    const userFound = await UserModel.findOne({email});

    if (!userFound) throw new BaseRequestError("Пользователь не найден", 404)


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

export const authService = new AuthService()
