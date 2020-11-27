import socket from 'socket.io';
import http from 'http';

export default (http: http.Server) => {
  const io = socket.listen(http);

  io.on('connection', function(socket: any) {
    socket.on('DIALOGS:JOIN', (dialogId: string) => {
      socket.dialogId = dialogId;
      socket.join(dialogId);
    });
  });

  return io;
};
