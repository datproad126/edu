import { Request, Response } from 'express'
import * as express from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'

class HomeController implements IControllerBase {
  public path = '/'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.get(this.path, this.index)
  }

  public index = (req: Request, res: Response, next: any): void => {
    try {
      res.send('well come to pdf api !! link document: <a href="https://documenter.getpostman.com/view/9037539/T1DiH1jb?version=latest">click here</a>')
    } catch (error) {
      console.error(error);
    }
  }

}

export default HomeController