"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const generatePDF = (invoiceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffer = [];
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
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "PDF creation error", error.message);
    }
});
exports.generatePDF = generatePDF;
