import { User } from "../models/user.model.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    if (req.userId) {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden - not authorized as admin",
        });
      }

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no userId found",
      });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware", error);
    return res.status(500).json({
      success: false,
      message: "Server error - unable to check admin role",
    });
  }
};
