import express from "express";
import {
  createAbout,
  getAllAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
} from "../../controllers/admin/about.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createAbout);

router.get("/", getAllAbout);

router.get("/:id", getAboutById);

router.patch("/:id", verifyToken, verifyAdmin, updateAbout);

router.delete("/:id", verifyToken, verifyAdmin, deleteAbout);

export default router;
