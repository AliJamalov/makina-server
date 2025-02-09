import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmailCode,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../../controllers/auth/auth.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmailCode);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
