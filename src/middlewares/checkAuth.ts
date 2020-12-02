import express from "express";
import verifyJWTToken, {DecodedData} from "../utils/verifyJWTToken";

export const checkAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (
    req.path === "/user/signin" ||
    req.path === "/user/signup" ||
    req.path.match(/append/)
  ) {
    return next();
  }

  if (req.method === "OPTIONS") {
    return next();
  }
  const headers: any = req.headers.authorization?.split(" ")
  const token: string | null | undefined = "authorization" in req.headers
    ? headers ? headers[headers.length - 1] : null
    : null;

  if (token) {
    verifyJWTToken(token)
      .then((user: DecodedData | null) => {
        if (user) {
          req.user = user.data;
        }
        next();
      })
      .catch(() => {
        res.status(401).json({message: "Invalid auth token provided."});
      });
  } else {
    res.status(401).json({message: "Invalid auth token provided."});
  }
};


