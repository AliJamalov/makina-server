import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "tr",
    preload: ["en", "tr", "ar", "ru"],
    ns: [
      "signup",
      "emailVerification",
      "forgotPassword",
      "login",
      "logout",
      "resetPassword",
      "resetPasswordEmailTemplate",
      "verifyEmailCode",
      "welcomeEmailTemplate",
    ],
    defaultNS: "login",
    detection: {
      order: ["query", "cookie", "header"],
      lookupQuerystring: "lng",
      caches: false,
    },
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
    },
  });

export default i18next;
export { middleware };
