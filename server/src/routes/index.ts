import * as express from 'express';
import { Application, Request, Response } from 'express';
import * as path from 'path';
import overridePdf from '../services/pdf'
import bodyParser from 'body-parser'

class Routes {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.setStaticDir();
    this.app.use(bodyParser.json());
  }

  private pdf(): void {
    this.app.get('/', (request: Request, response: Response) => {
      response.send('hello api!');
    });
    
    this.app.post('/api/v1/overridePDF', overridePdf)
  }

  // new
  private setStaticDir(): void {
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  public getRoutes(): void {
    this.pdf();
  }
}
export default Routes;