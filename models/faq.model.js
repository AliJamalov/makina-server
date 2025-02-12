import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  title: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ru: { type: String, required: true },
  },
  content: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

export default mongoose.model("Faq", FaqSchema);
