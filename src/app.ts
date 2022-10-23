import express, { Express, Request, Response } from "express";
import * as bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";

const app: Express = express();

app.use(cors());

app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/ping", (req, res) => {
  return res.send("pong");
});

app.use("/api/", routes);

export default app;
