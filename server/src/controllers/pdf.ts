import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Request, Response } from 'express'
import * as express from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import fetch from 'node-fetch'
import multer from 'multer'
import fs from 'fs'
import path, { join } from 'path'
import { type } from 'os'
const pdfToText = require('pdf-to-text')


class PdfController implements IControllerBase {
  public path = '/api/v1/pdf/'
  public router = express.Router()
  private upload: any
  private storage: any
  private pages: any

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.storage = multer.diskStorage({
      destination: (req: Request, _file: any, cb: any) => {
        try {
          cb(null, path.join(__dirname, '../../storage/uploads/'));
        } catch (error) {
          console.log(error);
        }
      },
      filename: (_req: Request, file: any, cb: any) => {
        const uniqueSuffix = new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname
        cb(null, uniqueSuffix)
      }
    })
    this.upload = multer({
      storage: this.storage,
      limits: { fileSize: 1000000 }
      // dest: '/storage/uploads/'
    })

    this.router.post(this.path + 'override-pdf', this.overridePdf)
    this.router.post(this.path + 'get-text', this.upload.single('pdf'), this.getText)
  }

  public overridePdf = async (req: Request, res: Response, next: any): Promise<any> => {
    try {
      console.log(req.body);
      if (req.body.session === "")
        return res.status(400).send({
          status: 'fail',
          message: 'session is required'
        })
      else if (req.body.url === "")
        return res.status(400).send({
          status: 'fail',
          message: 'url is required'
        })
      // handling pdf
      const existingPdfBytes = await fetch(req.body.url).then((res: any) => res.arrayBuffer())

      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      this.pages = pdfDoc.getPages()
      // this.pages.forEach((element: any) => {
      //   element.drawText(req.body.session, {
      //     x: 5,
      //     y: 100,
      //     size: 18,
      //     font: helveticaFont,
      //     color: rgb(1, 1, 1)
      //   })
      // });
      const randomPage = this.pages[45]
      randomPage.drawText(req.body.session, {
        x: 5,
        y: 100,
        size: 18,
        font: helveticaFont,
        color: rgb(0, 1, 1)
      });
      const pdfBytes = await pdfDoc.saveAsBase64();
      const getEncodePDF = (encodedPDF: string) => {
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="example.pdf"'
        });

        const download = Buffer.from(encodedPDF, 'base64');
        res.end(download);
      };
      return getEncodePDF(pdfBytes);
    } catch (error) {
      console.error(error);
    }
  }

  public getText = async (req: Request, res: Response, next: any): Promise<any> => {
    try {
      // console.log(req.file);
      // console.log(req.body.session);
      if (!req.file) {
        res.status(400).send({
          status: 'fail',
          message: 'file is not found'
        })
      }
      else if (!req.body.session) {
        res.status(400).send({
          status: 'fail',
          message: 'session is not found'
        })
      }
      const foundsession = {}
      // install poppler-until
      pdfToText.info(req.file.path, (err: any, info: any) => {
        if (err) throw (err);
        for (let index = 1; index <= info.pages; index++) {
          const option = { from: index, to: index }

          pdfToText.pdfToText(req.file.path, option, (err: any, data: any) => {
            if (err) throw (err);
            if (data.includes(req.body.session)) {
              console.log(index)
            }
          });
        }
      });

    } catch (error) {
      console.error(error);
    }
  }
}

export default PdfController