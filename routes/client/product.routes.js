import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../controllers/admin/product.controller.js";
import {
  getFilteredProducts,
  getProductById,
} from "../../controllers/client/product.controller.js";

const router = express.Router();

router.post("/", createProduct);

router.get("/", getFilteredProducts);

router.get("/:id", getProductById);

router.delete("/:id", deleteProduct);

router.patch("/:id", updateProduct);

export default router;
