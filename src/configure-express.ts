import * as express from "express";
import bodyParser from "body-parser";

import {
  authorization,
  extractInfoFromToken,
  unless,
  errorHandler,
  trimWhiteSpace,
  xss,
} from "./middleware";
import { uuidv4, nodemailerManager } from "./helpers";
import { Custom } from "./types";
import apiRoutes from "./routes";
import appConfig from "./app-config";
import path from "path";

const router = express.Router();

const skipAuthorizationForPaths: Custom.UnauthorizedPaths[] = [
  { path: "signin" },
  { path: "signup" },
  { path: "ad-signin" },
  { path: "two-step-authentication" },
  { path: "forgot-password" },
  { path: "resend-otp" },
  { path: "resend-otp-by-id" },
  { path: "verify-otp-by-id" },
  { path: "create-or-change-password" },
  { path: "support" },
  { path: "get-user-by-id", position: 4 },
  { path: "pipeline-completed", position: 4 },
  { path: "get-trust-name-id", position: 4 },
];

export default (app: express.Express) => {
  apiRoutes(router);

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      req.id = uuidv4(); // Assign an unique id for each request
      next();
    }
  );

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "500mb",
      parameterLimit: 50000,
    })
  );

  app.use(bodyParser.json({ limit: "500mb" }));

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Enable CORS
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-refresh"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, PUT, DELETE, GET, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Expose-Headers",
        "x-access-token, x-trust-name, file-name"
      );
      next();
    }
  );

  app.options(
    "*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (req.method === "OPTIONS") {
        return res.status(200).send();
      }
      next();
    }
  );

  app.use(express.static(path.join(__dirname, "../../dist")));

  app.use(xss);

  app.use(trimWhiteSpace);

  app.use(unless(skipAuthorizationForPaths, authorization));

  app.use(extractInfoFromToken);

  app.use(`/api/${appConfig.apiVersion}`, router);

  app.get("*", (req: express.Request, res: express.Response) => {
    return res.sendFile(path.join(__dirname, "../../dist/index.html"));
  });

  app.use(errorHandler);
};
