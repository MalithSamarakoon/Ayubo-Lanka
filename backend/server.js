import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./lib/db.js";


import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import patientRouter from "./routes/patientRoutes.js";
import productRouter from "./routes/product.route.js";


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Middleware
app.use(express.json({ limit: "10mb" }));

app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/patients", patientRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;
