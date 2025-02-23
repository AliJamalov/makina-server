import nodemailer from "nodemailer";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";
import { welcomeEmailTemplate } from "../templates/welcomeEmailTemplate.js";
import { resetPasswordEmailTemplate } from "../templates/resetPasswordEmailTemplate.js";

export const sendVerificationCodeEmail = async (
  email,
  code,
  language = "tr"
) => {
  const { subject, text, html } = verificationEmailTemplate(code, language);
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Ошибка при отправке email:", error.message);
    return false;
  }
};

export const sendWelcomeEmail = async (email, name, language = "tr") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { subject, text, html } = welcomeEmailTemplate(name, language);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Ошибка при отправке приветственного письма:", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (
  email,
  resetUrl,
  language = "tr"
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { subject, text, html } = resetPasswordEmailTemplate(
      resetUrl,
      language
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    console.log(
      `Письмо с инструкциями по сбросу пароля отправлено на ${email}`
    );
  } catch (error) {
    console.error("Ошибка при отправке письма для сброса пароля:", error);
    throw error;
  }
};
