import express from "express";
import {
  updateUserRole,
  deleteUser,
  getAllUsers,
} from "../../controllers/admin/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);

router.patch("/:id", updateUserRole);

router.delete("/:id", deleteUser);

export default router;
