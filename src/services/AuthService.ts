import {UserModel} from "../models/User";

class AuthService {
  async createUser(email: string, fullname: string, hashedPassword: string) {
    const user = new UserModel({
      email,
      fullname,
      password: hashedPassword,
    });
    await user.save();
  }
}

export const authService = new AuthService()
