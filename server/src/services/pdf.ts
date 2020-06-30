import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Request, Response } from 'express'
import fetch from 'node-fetch'
const overridePdf = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body);
    if (req.body.session)
    return res.status(400).send({
      success: 'false',
      message: 'session is required'
    })
  else if (req.body.url)
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
      color: rgb(0, 0.78, 1)
    })
  });

  const pdfBytes = await pdfDoc.save()
  console.log(pdfBytes);
  return res.status(201).send({
    success: 'true',
    message: 'handling pdf is successfuly'
  })
  } catch (error) {
    console.error(error);
  }
}

export default overridePdf