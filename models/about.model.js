import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  text: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ru: { type: String, required: true },
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model("About", AboutSchema);
