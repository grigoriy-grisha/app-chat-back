import { Socket, Server } from "socket.io";
import http from "http";

interface ClientInterface {
  dialogId?: string;
  userId?: string;
}

export const createSocket = (http: http.Server) => {
  const io = new Server(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", function (socket: Socket & ClientInterface) {
    socket.on("DIALOGS:JOIN", (dialogId: string) => {
      if (socket.dialogId) {
        socket.leave(socket.dialogId);
      }
      socket.join(dialogId);
      socket.dialogId = dialogId;
    });
  });
  return io;
};
