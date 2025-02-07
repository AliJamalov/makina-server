import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmailCode,
  forgotPassword,
  resetPassword,
} from "../../controllers/auth/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmailCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
