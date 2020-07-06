import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Request, Response } from 'express'
import * as express from 'express'
import IControllerBase from '../interfaces/IControllerBase.interface'
import fetch from 'node-fetch'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req: Request, _file: any, cb: any) => {
    cb(null, '/storage/uploads/');
    // const dir = './storage/';
    // mkdirp(dir, (err: NodeJS.ErrnoException) => {
    //     cb(err, dir)
    // });
  },
  filename: (_req: Request, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

class PdfController implements IControllerBase {
  public path = '/api/v1/pdf/'
  public router = express.Router()
  private upload = multer({ dest: 'storage/uploads/' })

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.post(this.path + 'override-pdf', this.overridePdf)
    this.router.post(this.path + 'get-text', this.upload.single('pdf'), this.getText)
  }

  public overridePdf = async (req: Request, res: Response, next: any): Promise<any> => {
    try {
      console.log(req.body);
      if (req.body.session === "")
        return res.status(400).send({
          success: 'false',
          message: 'session is required'
        })
      else if (req.body.url === "")
        return res.status(400).send({
          success: 'false',
          message: 'url is required'
        })
      // handling pdf
      const existingPdfBytes = await fetch(req.body.url).then((res: any) => res.arrayBuffer())

      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      const pages = pdfDoc.getPages()
      pages.forEach(element => {
        element.drawText(req.body.session, {
          x: 5,
          y: 100,
          size: 18,
          font: helveticaFont,
          color: rgb(1, 1, 1)
        })
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

  public getText = (req: Request, res: Response, next: any): any => {
    try {
      console.log(req.file);
      console.log(req.body);
    } catch (error) {
      console.error(error);
    }
  }
}

export default PdfController