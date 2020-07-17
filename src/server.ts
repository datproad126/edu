import App from "./app";
import * as bodyParser from 'body-parser'

// Middleware
import loggerMiddleware from './middlewares/logger'

// Controllers
import PdfController from './controllers/PdfController'
import HomeController from './controllers/HomeController'


const app = new App({
   port: 4002,
   controllers: [
      new PdfController(),
      new HomeController()
   ],
   middleWares: [
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      loggerMiddleware
   ]
})

app.listen()
