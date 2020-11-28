import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import socket from "socket.io";

import {DialogController} from "../controllers/DialogController";

import {checkAuth} from "../middlewares/checkAuth";
import {MessageController} from "../controllers/MessageController";
import {validateRegister} from "../utils/validation/registration";
import {validateLogin} from "../utils/validation/login";
import {UserController} from "../controllers/UserController";
import {RedirectController} from "../controllers/RedirectController";


export const createRoute = (app: express.Express, io: socket.Server) => {

  const userControls = new UserController();
  const dialogControls = new DialogController();
  const redirectController = new RedirectController()
  const messageController = new MessageController(io);


  app.post("/user/signup", validateRegister, userControls.create);
  app.post("/user/signin", validateLogin, userControls.login);

  app.post("/dialog/create", dialogControls.create);
  app.get("/dialog/get", dialogControls.getDialogs);

  app.post("/message/add", messageController.create);

  app.post('/append/:id', redirectController.redirect)
};
