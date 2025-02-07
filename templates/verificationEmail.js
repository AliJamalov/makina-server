import i18next from "../config/i18n.js";

export const verificationEmailTemplate = (code, lng = "tr") => {
  const subject = i18next.getFixedT(lng, "emailVerification")("subject");
  const text = i18next.getFixedT(lng, "emailVerification")("text", { code });
  const html = i18next.getFixedT(lng, "emailVerification")("html", { code });

  return { subject, text, html };
};
