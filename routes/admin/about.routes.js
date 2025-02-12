import express from "express";
import {
  createAbout,
  getAllAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
} from "../../controllers/admin/about.controller.js";

const router = express.Router();

router.post("/", createAbout);

router.get("/", getAllAbout);

router.get("/:id", getAboutById);

router.patch("/:id", updateAbout);

router.delete("/:id", deleteAbout);

export default router;
