// backend/routes/adminExportRoutes.js
import express from "express";
import PDFDocument from "pdfkit";


import Ticket from "../models/Ticket.js";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.get("/:type.pdf", async (req, res) => {
  try {
    const { type } = req.params;

    let rows = [];
    let title = "";

    if (type === "inquiries") {
      rows = await Support.find().sort({ createdAt: -1 });
      title = "Inquiries Report";
    } else if (type === "tickets") {
      rows = await Ticket.find().sort({ createdAt: -1 });
      title = "Tickets Report";
    } else if (type === "feedbacks") {
      rows = await Feedback.find().sort({ createdAt: -1 });
      title = "Feedbacks Report";
    } else {
      return res.status(400).json({ message: "Invalid report type" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${type}.pdf"`);

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(res);

    // Header
    doc.fontSize(18).text(title, { align: "center" });
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(new Date().toLocaleString(), { align: "center" })
      .moveDown(1)
      .fillColor("#000");

    // Rows
    rows.forEach((r, idx) => {
      doc.fontSize(12).text(`#${idx + 1}`, { continued: true }).text(`  ID: ${r._id}`);
      doc.moveDown(0.25);

      if (type === "inquiries") {
        doc.text(`Name: ${r.name || "-"}`);
        doc.text(`Email: ${r.email || "-"}`);
        doc.text(`Type: ${r.inquiryType || "-"}`);
        doc.text(`Subject: ${r.subject || "-"}`);
        doc.text(`Approved: ${r.isApproved ? "Yes" : "No"}`);
        doc.text(`Created: ${r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}`);
        doc.text(`Files: ${(r.files?.length ?? 0)}`);
      } else if (type === "tickets") {
        doc.text(`Ticket No: ${r.ticketNumber || "-"}`);
        doc.text(`Name: ${r.name || "-"}`);
        doc.text(`Email: ${r.email || "-"}`);
        doc.text(`Dept: ${r.department || "-"}`);
        doc.text(`Status: ${r.status || "-"}`);
        if (typeof r.approved !== "undefined") doc.text(`Approved: ${r.approved ? "Yes" : "No"}`);
        if (typeof r.rejected !== "undefined") doc.text(`Rejected: ${r.rejected ? "Yes" : "No"}`);
        doc.text(`Created: ${r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}`);
        doc.text(`Files: ${(r.attachments?.length ?? 0)}`);
      } else {
        // feedbacks
        doc.text(`Name: ${r.name || "Anonymous"}`);
        doc.text(`Email: ${r.email || "-"}`);
        doc.text(`Rating: ${typeof r.rating === "number" ? r.rating : "-"}/5`);
        doc.text(`Approved: ${r.isApproved ? "Yes" : "No"}`);
        doc.text(`Created: ${r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}`);
        doc.text(`Feedback: ${r.feedback || "-"}`);
      }

      // separator
      doc.moveDown(0.6);
      const y = doc.y;
      doc
        .moveTo(40, y)
        .lineTo(555, y)
        .lineWidth(0.5)
        .strokeColor("#ddd")
        .stroke()
        .strokeColor("#000")
        .moveDown(0.6);
    });

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).json({ message: "Failed to generate PDF", error: err.message });
  }
});

export default router;
