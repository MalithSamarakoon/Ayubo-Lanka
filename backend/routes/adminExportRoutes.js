// backend/routes/adminExportRoutes.js
import express from "express";
import PDFDocument from "pdfkit";
import Support from "../models/Support.js";

import Ticket from "../models/Ticket.js";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.get("/:type.pdf", async (req, res) => {
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

  doc.fontSize(18).text(title, { align: "center" }).moveDown(1);

  rows.forEach((r, idx) => {
    doc
      .fontSize(12)
      .text(`#${idx + 1}`, { continued: true })
      .text(`  ID: ${r._id}`)
      .moveDown(0.3);

    if (type === "inquiries") {
      doc.text(`Name: ${r.name || "-"}`);
      doc.text(`Email: ${r.email || "-"}`);
      doc.text(`Type: ${r.inquiryType || "-"}`);
      doc.text(`Subject: ${r.subject || "-"}`);
      doc.text(`Approved: ${r.approved ? "Yes" : "No"}`);
    } else if (type === "tickets") {
      doc.text(`Ticket No: ${r.ticketNumber}`);
      doc.text(`Name: ${r.name || "-"}`);
      doc.text(`Email: ${r.email || "-"}`);
      doc.text(`Dept: ${r.department || "-"}`);
      doc.text(`Status: ${r.status}`);
      if (r.approved !== undefined) doc.text(`Approved: ${r.approved ? "Yes" : "No"}`);
      if (r.rejected !== undefined) doc.text(`Rejected: ${r.rejected ? "Yes" : "No"}`);
    } else {
      doc.text(`Name: ${r.name || "Anonymous"}`);
      doc.text(`Rating: ${r.rating}/5`);
      doc.text(`Approved: ${r.isApproved ? "Yes" : "No"}`);
      doc.text(`Feedback: ${r.feedback}`);
    }

    doc.moveDown(0.6).moveTo(40, doc.y).lineTo(555, doc.y).stroke().moveDown(0.6);
  });

  doc.end();
});

export default router;
