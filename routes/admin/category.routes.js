import express from "express";
import {
  deleteCategory,
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../../controllers/admin/category.controller.js";

const router = express.Router();

router.post("/", createCategory);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.patch("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
