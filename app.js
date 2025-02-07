import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import i18next, { middleware } from "./config/i18n.js";

// Routes
import authRouter from "./routes/auth/auth.routes.js";

const app = express();
app.use(middleware.handle(i18next));
app.use(express.json());
app.use(cookieParser());

dotenv.config();

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// client routes
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
  });
});
