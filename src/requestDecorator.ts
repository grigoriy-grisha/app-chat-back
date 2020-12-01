import express from "express";


export function requestDecorator(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  const classMethod: Function = descriptor.value;
  descriptor.value = async function (
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await classMethod.call(this, req, res);
      res.json(result);

    } catch (e) {
      res
        .status(e.statusError ? e.statusError : 500)
        .json({message: e.message});
    }
  };
}
