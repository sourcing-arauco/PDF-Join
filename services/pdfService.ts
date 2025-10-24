
// This service uses pdf-lib, which is loaded from a CDN in index.html.
// We assert its type as `any` because we don't have its type definitions here.
declare const PDFLib: any;

export async function mergePdfs(files: File[]): Promise<Blob> {
  const { PDFDocument } = PDFLib;
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { 
      // Some PDFs have issues, this option helps to ignore them
      ignoreEncryption: true 
    });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}
