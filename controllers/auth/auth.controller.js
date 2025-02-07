import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";
import sendVerificationCodeEmail from "../../utils/sendVerificationCodeEmail.js";
import { resetPasswordEmailTemplate } from "../../templates/resetPasswordEmailTemplate.js";
import { welcomeEmailTemplate } from "../../templates/welcomeEmailTemplate.js";
import { User } from "../../models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Проверяем, что все обязательные поля заполнены
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Заполните все обязательные поля" });
    }

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    // Хешируем пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Генерируем 6-значный код
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // Устанавливаем время жизни кода (например, 1 час)
    const verificationTokenExpiresAt = new Date(Date.now() + 3600000);

    // Создаем нового пользователя с кодом подтверждения
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken: verificationCode, // здесь хранится 6-значный код
      verificationTokenExpiresAt: verificationTokenExpiresAt,
      isVerified: false,
    });

    await newUser.save();

    // Отправляем email с 6-значным кодом
    await sendVerificationCodeEmail(newUser.email, verificationCode);

    return res.status(201).json({
      message:
        "Пользователь успешно зарегистрирован. Проверьте вашу почту для подтверждения email.",
      user: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email уже подтвержден" });
    }

    if (user.verificationToken !== code) {
      return res.status(400).json({ message: "Неверный код" });
    }

    if (user.verificationTokenExpiresAt < new Date()) {
      return res.status(400).json({ message: "Код истек, запросите новый" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { subject, text, html } = welcomeEmailTemplate(
      user.name || user.email
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Email успешно подтвержден. Приветственное письмо отправлено!",
    });
  } catch (error) {
    console.error("Ошибка подтверждения email:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Находим пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    // Проверяем корректность пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    // (Опционально) Если требуется подтверждение email, можно проверить флаг isVerified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email не подтвержден" });
    }

    // Генерируем JWT-токен и устанавливаем его в cookies
    const token = generateTokenAndSetCookie(res, user._id);

    // Возвращаем ответ с токеном
    return res.json({ message: "Успешный вход", token });
  } catch (error) {
    console.error("Ошибка логина:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email не найден." });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expiresAt;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;

    // Используем шаблон для письма
    const { text, html } = resetPasswordEmailTemplate(resetUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Сброс пароля",
      text,
      html,
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);
    res.json({
      message: "Инструкции по сбросу пароля отправлены на вашу почту.",
    });
  } catch (error) {
    console.error("Ошибка при запросе сброса пароля:", error);
    res.status(500).json({ message: "Ошибка сервера." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Ищем пользователя по токену и проверяем, что токен не истёк
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Токен недействителен или истёк." });
    }

    // Хешируем новый пароль
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Обновляем пароль и очищаем поля токена
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    res.json({ message: "Пароль успешно изменён." });
  } catch (error) {
    console.error("Ошибка при сбросе пароля:", error);
    res.status(500).json({ message: "Ошибка сервера." });
  }
};
