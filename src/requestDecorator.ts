import express from "express";

export function requestDecorator(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  let originalMethod = descriptor.value;
  descriptor.value = async function (
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await (originalMethod as any).call(target, req, res);
      res.status(result.status).json({ ...result });
    } catch (e) {
      res
        .status(e.statusError ? e.statusError : 500)
        .json({ message: e.message });
    }
  };
}
