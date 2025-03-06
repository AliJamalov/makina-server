import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import i18next, { middleware } from "./config/i18n.js";
import { keepServerAwake } from "./utils/keepServerAwake.js";

// Routes
import authRouter from "./routes/auth/auth.routes.js";
import productRouter from "./routes/client/product.routes.js";
import userRouter from "./routes/admin/user.routes.js";
import categoryRouter from "./routes/admin/category.routes.js";
import aboutRouter from "./routes/admin/about.routes.js";
import faqRouter from "./routes/admin/faq.routes.js";
import contactRouter from "./routes/admin/contact.routes.js";
import addressRouter from "./routes/admin/address.routes.js";
import heroSectionRouter from "./routes/admin/heroSection.routes.js";
import orderRouter from "./routes/admin/order.routes.js";

const app = express();
app.use(middleware.handle(i18next));
app.use(express.json());
app.use(cookieParser());

dotenv.config();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Admin endpoints
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/about", aboutRouter);
app.use("/api/faq", faqRouter);
app.use("/api/contact", contactRouter);
app.use("/api/address", addressRouter);
app.use("/api/hero-section", heroSectionRouter);
app.use("/api/orders", orderRouter);

// Client endpoints
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});

keepServerAwake();
