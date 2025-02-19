import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../../controllers/admin/contact.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", createContact);

router.get("/", getContacts);

router.get("/:id", getContactById);

router.patch("/:id", verifyToken, verifyAdmin, updateContact);

router.delete("/:id", deleteContact);

export default router;
