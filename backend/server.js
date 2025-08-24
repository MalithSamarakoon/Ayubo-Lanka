import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
