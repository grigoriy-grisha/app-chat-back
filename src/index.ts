import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import config from "config";
import { createRoute } from "./core/route";
import { createSocket } from "./core/socket";

mongoose
  .connect(config.get("mongoUri"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const app = express();

const http = createServer(app);
export const io = createSocket(http);

createRoute(app);

const PORT: number = config.get("port");

http.listen(PORT, function () {
  console.log(`Server: http://localhost:${PORT}`);
});
