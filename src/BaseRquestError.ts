export class BaseRequestError extends Error {
  constructor(message: string, public statusError: number) {
    super(message);
  }
}
