import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import socket from "socket.io";

import {DialogController} from "../controllers/DialogController";

import {MessageController} from "../controllers/MessageController";
import {validateRegister} from "../utils/validation/registration";
import {validateLogin} from "../utils/validation/login";
import {UserController} from "../controllers/UserController";
import {RedirectController} from "../controllers/RedirectController";
import {LinkController} from "../controllers/LinkController";


export const createRoute = (app: express.Express, io: socket.Server) => {

  const userControls = new UserController();
  const linkController = new LinkController();
  const dialogControls = new DialogController();
  const redirectController = new RedirectController();
  const messageController = new MessageController(io);


  app.post("/user/signup", validateRegister, userControls.create);
  app.post("/user/signin", validateLogin, userControls.login);

  app.post("/dialog/create", dialogControls.create);
  app.get("/dialog/get", dialogControls.getDialogs);
  app.post("/dialog/userAdd", dialogControls.addUser)

  app.post("/message/add", messageController.create);
  app.get("/message/get", messageController.index);

  app.get('/append/:id', redirectController.redirect)

  app.get('/redirect', linkController.redirect)

};
