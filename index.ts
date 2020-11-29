import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import config from "config";
//TODO сделать адекватное добавление пользователя
import {createRoute} from "./core/route";
import {createSocket} from "./core/socket";
import cors from "cors";
import bodyParser from "body-parser";
import {checkAuth} from "./middlewares/checkAuth";
import {RedirectController} from "./controllers/RedirectController";
import cookieParser from "cookie-parser";

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
const io = createSocket(http);

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser('as'))
app.use(checkAuth);

export let req: express.Request
export let res: express.Response

app.use((request: express.Request, response: express.Response, next:express.NextFunction) => {
  req = request
  res = response
  next()
})



createRoute(app, io)





const PORT: number = config.get('port');
// config.get('baseUrl')

http.listen(PORT, function () {
  console.log(`Server: http://localhost:${PORT}`);
});
