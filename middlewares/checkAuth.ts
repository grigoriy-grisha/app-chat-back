import express from "express";
import verifyJWTToken, { DecodedData } from "../utils/verifyJWTToken";

export const checkAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (
    req.path === "/user/signin" ||
    req.path === "/user/signup"
  ) {
    return next();
  }

  if (req.method === "OPTIONS") {
    return next();
  }

  const token: string | null | undefined = "authorization" in req.headers
    ? req.headers.authorization?.split(" ")[1]  // "Bearer TOKEN"
    : null;

  console.log(token);
  // const token: string | null= req.headers.authorization.split(' ')[1]
  if (token) {
    verifyJWTToken(token)
      .then((user: DecodedData | null) => {
        if (user) {
          req.user = user.data;
        }
        next();
      })
      .catch(() => {
        res.status(403).json({ message: "Invalid auth token provided." });
      });
  } else {
    res.status(403).json({ message: "Invalid auth token provided." });
  }
};


