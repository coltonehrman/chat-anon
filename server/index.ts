import ChatRoom from "./models/ChatRoom.js";
import ChatRoomController from "./controllers/ChatRoomController.js";
import { IOEvents } from "../@types/enums.js";
import { Server as IOServer } from "socket.io";
import User from "./models/User.js";
import ViteExpress from "vite-express";
import express from "express";
import { fileURLToPath } from "url";
import http from "http";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const httpServer = http.createServer(app);
const io = new IOServer(httpServer);
const port: number = //? avoids extra string->number parsing
  process.env.PORT ? parseInt(process.env.PORT) : 3000;

const roomController = new ChatRoomController(io);

io.on(IOEvents.connection, (socket) => {
  let room: ChatRoom | undefined;
  //? new user
  const user: User = User.create(socket);

  io.emit(IOEvents.clientsCount, io.engine.clientsCount);

  socket.on(IOEvents.joinRoom, () => {
    // Don't allow to join room if already exists
    if (room) return;

    //? find or create a room for the user + add to room
    room = roomController.addUserToValidChatRoom(user, 2);
  });

  socket.on(IOEvents.sendMessage, (message) => {
    if (!room?.id) return;

    io.to(room.id).emit(IOEvents.newMessage, {
      from: socket.id,
      message,
    });
  });

  socket.on(IOEvents.disconnect, () => {
    room?.removeUser(user);
    io.emit(IOEvents.clientsCount, io.engine.clientsCount);
  });
});

app.get("/chat$", (_, res) => {
  res.redirect("/chat/");
});

httpServer.listen(port, () => {
  console.log("Server is listening...");
});

ViteExpress.config({
  viteConfigFile: path.resolve(__dirname, "..", "client", "vite.config.ts"),
});

ViteExpress.bind(app, httpServer);
