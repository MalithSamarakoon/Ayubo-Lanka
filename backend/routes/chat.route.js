import express from "express";
import { askChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/ask", askChat);

export default router;
