import http from "http";
import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port: number = //? avoids extra string->number parsing
  typeof process.env.PORT == "undefined" ? 3000 : parseInt(process.env.PORT);
httpServer.listen(port, () => {
  console.log("Server is listening...");
});

ViteExpress.bind(app, httpServer);
