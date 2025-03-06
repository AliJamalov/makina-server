import i18next from "../config/i18n.js";

export const resetPasswordEmailTemplate = (resetUrl, lng = "tr") => {
  const subject = i18next.getFixedT(lng, "resetPasswordEmailTemplate")("subject");
  const text = i18next.getFixedT(lng, "resetPasswordEmailTemplate")("text", {
    resetUrl,
  });
  const html = i18next.getFixedT(lng, "resetPasswordEmailTemplate")("html", {
    resetUrl,
  });

  return { subject, text, html };
};
