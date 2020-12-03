import { messageService } from "../services/MessageService";
import { requestDecorator } from "../requestDecorator";
import { RequestInterface } from "../types";

interface BodyInterface {
  dialog: string;
  text: string;
}

interface RequestInterfaceParams {
  params: {
    id: string;
  };
}

export class MessageController {
  @requestDecorator
  async create({
    body: { text },
    params: { id },
    user: author,
  }: RequestInterface<BodyInterface> & RequestInterfaceParams) {
    return await messageService.create({ author, id, text });
  }

  @requestDecorator
  async get({
    params: { id },
    user: author,
  }: RequestInterfaceParams & RequestInterface<{}>) {
    return await messageService.getMessage(id, author);
  }
}
