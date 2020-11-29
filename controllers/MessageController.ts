import express from "express";
import socket from "socket.io";
import {req, res} from "../index";
import {messageService} from "../services/MessageService";

export class MessageController {
  constructor(private io: socket.Server) {
  }

  create = async () => {
    try {
      const {dialog, text} = req.body;
      const author: any = req.user;
      const io = this.io
      const userFound = await messageService.checkDialogsUser(dialog, author)

      !userFound
        ? res.status(404).json({message: "Пользователь не состоит в диалоге!"})
        : await messageService.create({author, dialog, text, io})
    } catch (e) {
      res.status(500).json({message: "Что-то пошло не так!"})
    }

  };


  index = async () => {
    const dialogId: string =
      req.query && req.query.dialog ? (req.query as any).dialog : "";

    await messageService.getMessage(dialogId)

  };
}
