declare namespace Express {
  import { IUser } from "./src/models/User";

  export interface Request {
    user?: IUser;
  }
}
