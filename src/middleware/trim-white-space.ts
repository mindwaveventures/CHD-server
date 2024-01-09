import * as express from "express";

export default (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const trimObj = (obj: any) => {
    if ((!Array.isArray(obj) && typeof obj !== "object") || obj === null)
      return obj;
    return Object.keys(obj).reduce(
      (acc: any, key) => {
        acc[key.toString().trim()] =
          typeof obj[key.toString()] === "string"
            ? obj[key.toString()].trim()
            : trimObj(obj[key.toString()]);
        return acc;
      },
      Array.isArray(obj) ? [] : {}
    );
  };
  req.body = trimObj(req.body);
  next();
};
