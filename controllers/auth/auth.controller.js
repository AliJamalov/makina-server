import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";
import { sendVerificationCodeEmail } from "../../utils/sendEmails.js";
import { sendWelcomeEmail } from "../../utils/sendEmails.js";
import { sendResetPasswordEmail } from "../../utils/sendEmails.js";
import { User } from "../../models/user.model.js";
import i18next from "../../config/i18n.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    const language = req.query.lng || "tr";

    if (!email || !password || !name || !phone) {
      return res.status(400).json({
        message: i18next.t("signup:missingFields", { lng: language }),
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: i18next.t("signup:userExists", { lng: language }),
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const verificationTokenExpiresAt = new Date(Date.now() + 3600000);

    const newUser = new User({
      email,
      phone,
      password: hashedPassword,
      name,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: verificationTokenExpiresAt,
      isVerified: false,
    });

    await newUser.save();

    try {
      await sendVerificationCodeEmail(newUser.email, verificationCode, language);
    } catch (emailError) {
      console.error("Ошибка отправки письма:", emailError);
      return res.status(500).json({
        message: i18next.t("signup:emailError", { lng: language }),
      });
    }

    return res.status(201).json({
      message: i18next.t("signup:success", { lng: language }),
      user: {
        _id: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({ message: i18next.t("signup:serverError", { lng: language }) });
  }
};

export const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  const language = req.query.lng || "tr";

  try {
    await i18next.changeLanguage(language);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: i18next.t("verifyEmailCode:userNotFound", { lng: language }),
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: i18next.t("verifyEmailCode:emailAlreadyVerified", {
          lng: language,
        }),
      });
    }

    if (user.verificationToken !== code) {
      return res.status(400).json({
        message: i18next.t("verifyEmailCode:incorrectCode", {
          lng: language,
        }),
      });
    }

    if (user.verificationTokenExpiresAt < new Date()) {
      return res.status(400).json({
        message: i18next.t("verifyEmailCode:codeExpired", { lng: language }),
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    await sendWelcomeEmail(user.email, user.name || user.email, language);

    res.status(200).json({
      message: i18next.t("verifyEmailCode:emailVerifiedSuccessfully", {
        lng: language,
      }),
      user,
    });
  } catch (error) {
    console.error("Ошибка подтверждения email:", error);
    res.status(500).json({
      message: i18next.t("verifyEmailCode:serverError", { lng: language }),
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const language = req.query.lng || "tr";

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: i18next.t("login:invalidCredentials", { lng: language }),
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: i18next.t("login:invalidCredentials", { lng: language }),
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: i18next.t("login:emailNotVerified", { lng: language }),
      });
    }

    const token = generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({
      message: i18next.t("login:loginSuccessful", { lng: language }),
      token,
      user,
    });
  } catch (error) {
    console.error("Ошибка логина:", error);
    return res.status(500).json({
      message: i18next.t("login:serverError", { lng: language }),
    });
  }
};

export const logout = async (req, res) => {
  const language = req.query.lng || "tr";
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None", // Если у вас кросс-доменные запросы
    secure: true, // Для HTTPS
  });

  res.status(200).json({
    success: true,
    message: i18next.t("logout:logoutSuccessful", { lng: language }),
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const language = req.query.lng || "tr";

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: i18next.t("forgotPassword:userNotFound", { lng: language }),
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expiresAt;
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

    await sendResetPasswordEmail(user.email, resetUrl, language);

    res.json({
      message: i18next.t("forgotPassword:resetPasswordInstructions", {
        lng: language,
      }),
    });
  } catch (error) {
    console.error("Ошибка при запросе сброса пароля:", error);
    res.status(500).json({
      message: i18next.t("forgotPassword:serverError", { lng: language }),
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const language = req.query.lng || "tr";

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: i18next.t("resetPassword:invalidTokenOrExpired", {
          lng: language,
        }),
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.json({
      message: i18next.t("resetPassword:passwordChangedSuccessfully", {
        lng: language,
      }),
    });
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    res.status(500).json({
      message: i18next.t("resetPassword:serverError", { lng: language }),
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
