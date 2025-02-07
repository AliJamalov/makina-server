import i18next from "../config/i18n.js";

export const welcomeEmailTemplate = (userName, lng = "tr") => {
  const subject = i18next.getFixedT(lng, "welcomeEmailTemplate")("subject", {
    userName,
  });
  const text = i18next.getFixedT(lng, "welcomeEmailTemplate")("text", {
    userName,
  });
  const html = i18next.getFixedT(lng, "welcomeEmailTemplate")("html", {
    userName,
  });

  return { subject, text, html };
};
