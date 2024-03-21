import express from "express";
import ViteExpress from "vite-express";

const app = express();

ViteExpress.listen(app, parseInt(process.env.PORT || "3000"), () => {
  console.log("Server is listening...");
});
