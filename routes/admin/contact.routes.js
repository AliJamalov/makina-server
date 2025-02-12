import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../../controllers/admin/contact.controller.js";

const router = express.Router();

router.post("/", createContact);

router.get("/", getContacts);

router.get("/:id", getContactById);

router.patch("/:id", updateContact);

router.delete("/:id", deleteContact);

export default router;
