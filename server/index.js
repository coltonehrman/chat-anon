import express from "express";
import ViteExpress from "vite-express";
var app = express();
ViteExpress.listen(app, parseInt(process.env.PORT || "3000"), function () {
    console.log("Server is listening...");
});
