import { hash } from "bcrypt";
import { requestDecorator } from "../requestDecorator";
import { authService } from "../services/AuthService";
import { userService } from "../services/UserService";
import { RequestInterface } from "../types";

interface BodyInterface {
  email: string;
  fullname: string;
  password: string;
}

export class UserController {
  @requestDecorator
  async create({
    body: { email, fullname, password },
  }: RequestInterface<BodyInterface>) {
    await authService.checkUserByEmail(email);
    const hashedPassword = await hash(password, 12);
    await authService.createUser(email, fullname, hashedPassword);
    return { status: 201, message: "Пользователь создан" };
  }

  @requestDecorator
  async login({ body: { email, password } }: RequestInterface<BodyInterface>) {
    return await authService.checkPasswordUser(password, email);
  }

  @requestDecorator
  async changePassword({
    body: { password },
    user: author,
  }: RequestInterface<BodyInterface>) {
    const hashedPassword = await hash(password, 12);
    return userService.changePassword(author, hashedPassword);
  }

  @requestDecorator
  getAllUser({ user: author }: RequestInterface<{}>) {
    return userService.getAll(author);
  }
}
