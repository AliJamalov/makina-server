import nodemailer from "nodemailer";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";

const sendVerificationCodeEmail = async (email, code) => {
  const { text, html } = verificationEmailTemplate(code);
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
      subject: "Email Verification",
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Письмо с кодом отправлено на ${email}`);
  } catch (error) {
    console.error("Ошибка при отправке email с кодом:", error);
    throw error;
  }
};

export default sendVerificationCodeEmail;
