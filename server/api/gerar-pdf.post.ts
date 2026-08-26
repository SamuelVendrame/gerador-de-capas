import { PDFDocument } from "pdf-lib";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { imagemBase64, titulo } = body;

  if (!imagemBase64) {
    throw createError({ statusCode: 400, statusMessage: "imagemBase64 é obrigatório" });
  }

  const base64Puro = imagemBase64.replace(/^data:image\/\w+;base64,/, "");
  const bytesImagem = Buffer.from(base64Puro, "base64");

  const pdfDoc = await PDFDocument.create();
  const imagemPdf = await pdfDoc.embedPng(bytesImagem);

  const { width, height } = imagemPdf.scale(1);
  const pagina = pdfDoc.addPage([width, height]);
  pagina.drawImage(imagemPdf, { x: 0, y: 0, width, height });

  const pdfBytes = await pdfDoc.save();

  setResponseHeader(event, "Content-Type", "application/pdf");
  setResponseHeader(event, "Content-Disposition", `attachment; filename="${titulo ?? "capa"}.pdf"`);

  return Buffer.from(pdfBytes);
});