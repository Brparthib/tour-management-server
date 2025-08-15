/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

export const generatePDF = async (
  invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => {
        buffer.push(chunk);
      });
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // PDF Content
      doc.rect(0, 0, doc.page.width, 80).fill("#4f46e5"); // Blue header background
      doc
        .fillColor("#ffffff")
        .fontSize(28)
        .font("Helvetica-Bold")
        .text("Invoice", 50, 25, { align: "center" });

      doc.moveDown(2);

      // ===== TRANSACTION DETAILS =====
      doc
        .fillColor("#000000")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Transaction Details", { underline: true });

      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(12);
      doc.text(`Transaction ID: ${invoiceData.transactionId}`);
      doc.text(`Booking Date: ${invoiceData.bookingDate}`);
      doc.text(`Customer: ${invoiceData.userName}`);

      doc.moveDown(1);

      // ===== TOUR DETAILS =====
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text("Tour Information", { underline: true });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(12);
      doc.text(`Tour: ${invoiceData.tourTitle}`);
      doc.text(`Guests: ${invoiceData.guestCount}`);
      doc.text(`Total Amount: ${invoiceData.totalAmount} BDT`);

      // Add a separator line
      doc.moveDown(1);
      doc
        .strokeColor("#cccccc")
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      // ===== FOOTER =====
      doc.moveDown(2);
      doc
        .font("Helvetica-Oblique")
        .fontSize(12)
        .fillColor("#4f46e5")
        .text("Thank You for booking with us!!", { align: "center" });

      // Save PDF
      doc.end();
    });
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "PDF creation error",
      error.message
    );
  }
};
