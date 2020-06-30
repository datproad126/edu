import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Request, Response } from 'express'
import fetch, { Blob } from 'node-fetch'
import { saveAs } from 'file-saver';
const overridePdf = async (req: Request, res: Response): Promise<any> => {
  try {
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
    res.writeHead(200,  {
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

export default overridePdf