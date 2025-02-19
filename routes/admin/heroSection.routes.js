import express from "express";
import {
  createHeroSection,
  deleteHeroSection,
  getAllHeroSections,
} from "../../controllers/admin/heroSection.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllHeroSections);

router.post("/", verifyToken, verifyAdmin, createHeroSection);

router.delete("/:id", verifyToken, verifyAdmin, deleteHeroSection);

export default router;
