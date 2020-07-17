import express = require("express");
import * as http from "http";
import * as path from "path";
import { Request, Response, Application } from "express";
import HttpException from "./exceptions/HttpException"
import { runInThisContext } from "vm";


class App {
  public app!: Application;
  public port: number;
  private expressServer!: http.Server;

  constructor(appInit: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;
    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
    this.template();
  }
  // express js mvc
  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }): void {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }
  private routes(controllers: {
    forEach: (arg0: (controllers: any) => void) => void;
  }): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
    this.app.use((req: Request, res: Response, next: any) => {
      const err = new HttpException(404, `${req.method} ${req.url} Not Found`)
      next(err);
    });
    this.app.use((err: HttpException, req: Request, res: Response, next: any) => {
      console.error(err);
      res.status(err.status || 500);
      res.json({
        error: {
          message: err.message,
        },
      });
    });
  }
  private assets(): void {
    this.app.use(express.static("./public"));
    // this.app.use(express.static('./views'))
  }

  private template(): void {
    // this.app.set('view engine', 'pug')
    this.app.set("view engine", "jade");
    this.app.set("views", path.join(__dirname, "views"));
  }

  public listen(): void {
    try {
      this.expressServer = http.createServer(this.app);
      this.expressServer.listen(this.port, () => {
        console.log(`Server is listening on port ${String(this.port)} !`);
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default App;
