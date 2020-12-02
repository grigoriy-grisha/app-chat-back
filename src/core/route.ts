import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import {DialogController} from "../controllers/DialogController";

import {MessageController} from "../controllers/MessageController";
import {UserController} from "../controllers/UserController";
import {RedirectController} from "../controllers/RedirectController";

import {checkAuth} from "../middlewares/checkAuth";
import cookieParser from "cookie-parser";

export const createRoute = (app: express.Express) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(checkAuth);
  app.use(cookieParser('secret'))

  const userControls = new UserController();
  const dialogControls = new DialogController();
  const messageController = new MessageController();
  const redirectController = new RedirectController();

  app.get("/append/:id", redirectController.redirect);
  app.post("/user/signup", userControls.create);
  app.post("/user/signin", userControls.login);
  app.get('/user/all', userControls.getAllUser)

  app.post("/dialog/createDialog", dialogControls.createDialog);
  app.get("/dialog/get", dialogControls.getDialogs);
  app.post("/dialog/author/dialog/add", dialogControls.addUserToDialog);
  app.get("/dialog/all", dialogControls.getAllDialogs);
  app.get("/dialog/getDialog/:id", dialogControls.getDialogInfo)
  app.post('/dialog/addUser', dialogControls.addUserDialog)


  app.post("/message/:id/add", messageController.create);
  app.get("/message/get/:id", messageController.get);


};
