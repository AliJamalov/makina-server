import express from "express";
import {
  updateUserRole,
  deleteUser,
  getAllUsers,
} from "../../controllers/admin/user.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { verifyAdmin } from "../../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", getAllUsers);

router.patch("/:id", verifyToken, verifyAdmin, updateUserRole);

router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
