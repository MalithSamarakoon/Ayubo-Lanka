// backend/models/Ticket.js
const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const ResponseSchema = new mongoose.Schema({
  message: String,
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAdminResponse: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  attachments: [AttachmentSchema]
}, { _id: true });

const TicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  priority: { type: String, enum: ['low','medium','high','urgent'], default: 'medium', required: true },
  department: { type: String, enum: ['general','products','treatments','billing','technical'], required: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: { type: String, enum: ['open','in-progress','resolved','closed'], default: 'open', index: true },
  attachments: [AttachmentSchema],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  responses: [ResponseSchema],
  resolvedAt: Date,
  closedAt: Date
}, { timestamps: true });

TicketSchema.statics.generateTicketNumber = function () {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `TKT-${timestamp}-${random}`;
};

TicketSchema.index({ createdAt: -1 });
TicketSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', TicketSchema);
