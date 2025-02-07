import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRouter from "./routes/auth/auth.routes.js";

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "tr", "ar"],
    detection: {
      order: ["path", "cookie", "header"],
      lookupFromPathIndex: 0,
      caches: false,
    },
    backend: {
      loadPath: path.join(__dirname, "/locales/{{lng}}/translation.json"),
    },
  });

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
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
