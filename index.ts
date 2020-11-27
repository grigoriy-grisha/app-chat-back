import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import config from "config";
import createSocket from "./core/socket";
import { UserController } from "./controllers/UserController";
import { DialogController } from "./controllers/DialogController";
import { MessageController } from "./controllers/MessageController";
import cors from "cors";
import bodyParser from "body-parser";
import { checkAuth } from "./middlewares/checkAuth";
import { validateRegister } from "./utils/validation/registration";
import { validateLogin } from "./utils/validation/login";


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

console.log(createSocket(http));
const userControls = new UserController();
const dialogControls = new DialogController();
const messageController = new MessageController(createSocket(http))
app.use(cors());
app.use(bodyParser.json());
app.use(checkAuth);

app.post("/user/signup", validateRegister, userControls.create);
app.post("/user/signin", validateLogin, userControls.login);

app.post('/dialog/create', dialogControls.create)
app.get("/dialog/get", dialogControls.getDialogs)

app.post("/message/add", messageController.create)

const PORT: number = config.get('port');
// config.get('baseUrl')

http.listen(PORT, function () {
  console.log(`Server: http://localhost:${PORT}`);
});
