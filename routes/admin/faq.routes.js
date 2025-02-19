import express from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../../controllers/admin/faq.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllFaqs);

router.get("/:id", getFaqById);

router.post("/", verifyToken, verifyAdmin, createFaq);

router.patch("/:id", verifyToken, verifyAdmin, updateFaq);

router.delete("/:id", verifyToken, verifyAdmin, deleteFaq);

export default router;
