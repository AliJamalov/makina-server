import mongoose from "mongoose";

const HeroSectionSchema = new mongoose.Schema({
  images: {
    en: { type: String, required: true },
    ru: { type: String, required: true },
    tr: { type: String, required: true },
    ar: { type: String, required: true },
  },
});

export default mongoose.model("HeroSection", HeroSectionSchema);
