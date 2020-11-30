import { messageService } from "../services/MessageService";
import { requestDecorator } from "../requestDecorator";
import { BaseRequestError } from "../BaseRquestError";

interface RequestInterface {
  body: {
    dialog: string;
    text: string;
  };
}

interface RequestInterfaceParams {
  params: {
    id: string;
  };
}

interface RequestUserInterface {
  user: string;
}

export class MessageController {
  constructor() {}

  @requestDecorator
  async create({
    body: { dialog, text },
    user: author,
  }: RequestInterface & RequestUserInterface) {
    const userFound = await messageService.checkDialogsUser(dialog, author);
    if (!userFound)
      throw new BaseRequestError("Пользователь не состоит в диалоге!", 403);
    return await messageService.create({ author, dialog, text });
  }

  @requestDecorator
  async get({
    params: { id },
    user: author,
  }: RequestInterfaceParams & RequestUserInterface) {
    return await messageService.getMessage(id, author);
  }
}
