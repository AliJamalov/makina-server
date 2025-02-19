import express from "express";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../controllers/admin/address.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", getAddresses);

router.get("/:id", getAddressById);

router.post("/", verifyToken, verifyAdmin, createAddress);

router.patch("/:id", verifyToken, verifyAdmin, updateAddress);

router.delete("/:id", verifyToken, verifyAdmin, deleteAddress);

export default router;
