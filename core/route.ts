import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import socket from "socket.io";

import { UserController } from "../controllers/UserController";
import { DialogController } from "../controllers/DialogController";

import { validateRegister } from "../utils/validation/registration";
import { validateLogin } from "../utils/validation/login";

import { checkAuth } from "../middlewares/checkAuth";
import { MessageController } from "../controllers/MessageController";

export default (app: express.Express, io: socket.Server) => {
  console.log(io);
  const userControls = new UserController();
  const dialogControls = new DialogController();
  const messageController = new MessageController(io);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(checkAuth);

  app.post("/user/signup", validateRegister, userControls.create);
  app.post("/user/signin", validateLogin, userControls.login);

  app.post("/dialog/create", dialogControls.create);
  app.get("/dialog/get", dialogControls.getDialogs);

  app.post("/message/add", messageController.create);
};
