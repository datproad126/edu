import * as http from 'http'
import express = require('express');
import * as path from 'path'
import { Application } from 'express'

class App {
  public app!: Application;
  public port: number;
  private expressServer!: http.Server;
  private message: any;
  constructor(port: number) {
    this.port = port;
    this.createApp();
    this.createExpressServer();
  }
  // express js

  private createApp(): void {
    this.app = express();
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'jade');
    this.app.use(express.static('public'));
  }

  private createExpressServer(): void {
    this.expressServer = http.createServer(this.app);
    this.expressServer.listen(this.port, () => {
      console.log('Server is listening on port ' + String(this.port) + '!');
    })
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;