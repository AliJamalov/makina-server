import express from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../../controllers/admin/faq.controller.js";

const router = express.Router();

router.get("/", getAllFaqs);

router.get("/:id", getFaqById);

router.post("/", createFaq);

router.patch("/:id", updateFaq);

router.delete("/:id", deleteFaq);

export default router;
