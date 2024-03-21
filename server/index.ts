import http from "http";
import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(socket.id);
});

httpServer.listen(parseInt(process.env.PORT || "3000"), () => {
  console.log("Server is listening...");
});

ViteExpress.bind(app, httpServer);
