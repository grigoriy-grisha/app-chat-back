import socket from "socket.io";
import http from "http";

export const createSocket = (http: http.Server) => {
  const io = socket(http);

  io.on("connection", function (socket: any) {});

  return io;
};
