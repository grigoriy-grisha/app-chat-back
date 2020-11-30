import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { DialogController } from "../controllers/DialogController";

import { MessageController } from "../controllers/MessageController";
import { UserController } from "../controllers/UserController";
import { RedirectController } from "../controllers/RedirectController";
import { LinkController } from "../controllers/LinkController";
import { checkAuth } from "../middlewares/checkAuth";

export const createRoute = (app: express.Express) => {
  app.use(cors());
  app.use(bodyParser.json());
  // app.use(cookieParser('as'))
  app.use(checkAuth);

  const userControls = new UserController();
  const linkController = new LinkController();
  const dialogControls = new DialogController();
  const messageController = new MessageController();
  const redirectController = new RedirectController();

  app.post("/user/signup", userControls.create);
  app.post("/user/signin", userControls.login);

  app.post("/dialog/create", dialogControls.create);
  app.get("/dialog/get", dialogControls.getDialogs);
  app.post("/dialog/userAdd", dialogControls.addUser);
  app.get("/dialog/all", dialogControls.getAll);

  app.post("/message/add", messageController.create);
  app.get("/message/get/:id", messageController.get);

  app.get("/append/:id", redirectController.redirect);
  //
  // app.get('/redirect', linkController.redirect)
};
