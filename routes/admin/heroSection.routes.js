import express from "express";
import {
  createHeroSection,
  deleteHeroSection,
  getAllHeroSections,
} from "../../controllers/admin/heroSection.controller.js";

const router = express.Router();

router.get("/", getAllHeroSections);

router.post("/", createHeroSection);

router.delete("/:id", deleteHeroSection);

export default router;
