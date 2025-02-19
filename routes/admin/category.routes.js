import express from "express";
import {
  deleteCategory,
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../../controllers/admin/category.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createCategory);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.patch("/:id", verifyToken, verifyAdmin, updateCategory);

router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

export default router;
