import App from "./app";
import * as bodyParser from 'body-parser'

// Middleware
import loggerMiddleware from './middlewares/logger'

// Controllers
import PdfController from './controllers/pdf'


const app = new App({
   port: 4002,
   controllers: [
      new PdfController()
   ],
   middleWares: [
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      loggerMiddleware
   ]
})

app.listen()
