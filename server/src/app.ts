import * as http from 'http'
import express = require('express')
import * as path from 'path'
import { Application } from 'express'

class App {
  public app!: Application;
  public port: number;
  private expressServer!: http.Server;

  constructor(appInit: { port: number; middleWares: any; controllers: any; }) {
    this.app = express();
    this.port = appInit.port;
    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
    this.template();
  }
  // express js mvc
  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }): void {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare)
    })
  }
  private routes(controllers: { forEach: (arg0: (controllers: any) => void) => void; }): void {
    controllers.forEach(controller => {
      this.app.use('/', controller.router)
    });
  }
  private assets(): void {
    this.app.use(express.static('./public'))
    // this.app.use(express.static('./views'))
  }

  private template(): void {
    // this.app.set('view engine', 'pug')
    this.app.set('view engine', 'jade')
    this.app.set('views', path.join(__dirname, 'views'))
}

  public listen(): void {
    this.expressServer = http.createServer(this.app);
    this.expressServer.listen(this.port, () => {
      console.log('Server is listening on port ' + String(this.port) + '!');
    })
  }
}

export default App;