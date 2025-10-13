import express from "express";
import { askChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/ask", askChat);

export default chatRouter;
