import http from "http";
import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import Events from "./socket.io/Events";
import UserConnector from "./controllers/UserConnector";
import SocketUser from "./models/SocketUser";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port: number = //? avoids extra string->number parsing
  typeof process.env.PORT == "undefined" ? 3000 : parseInt(process.env.PORT);

const userConnectionManager = new UserConnector();

io.on(Events.join, (socket) => {
  const user = SocketUser.createRandomWithSocket(socket.id);
  userConnectionManager.addUser(user);

  const userConnectedTo = userConnectionManager.connectToWaitingUser(user);
  if (userConnectedTo) {
    //? Notify both users that they are paired now
    io.to(user.socketId).emit(Events.paired, userConnectedTo.id);
    io.to(userConnectedTo.socketId).emit(Events.paired, user.id);
  } else {
    //? Broadcast that a this user is waiting
    io.emit(Events.waiting, user.id);
  }

  io.on(Events.leave, () => {
    if (userConnectedTo) userConnectionManager.disconnectUsers(user, user);
    userConnectionManager.removeUser(user);
  });
});

httpServer.listen(port, () => {
  console.log("Server is listening...");
});

ViteExpress.bind(app, httpServer);
