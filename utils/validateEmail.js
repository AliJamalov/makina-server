import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const validateEmail = async (email) => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const url = `https://api.mailgun.net/v4/address/validate`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: "api",
        password: apiKey,
      },
      params: {
        address: email,
      },
    });

    return response.data.is_valid;
  } catch (error) {
    console.error("Ошибка при проверке email:", error.response?.data || error);
    return false;
  }
};
