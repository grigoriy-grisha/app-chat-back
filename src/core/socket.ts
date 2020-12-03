import socket, { Socket } from "socket.io";
import http from "http";

export const createSocket = (http: http.Server) => {
  const io = socket.listen(http);

  io.on("connection", function (socket: Socket & { dialogId?: string }) {
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
