import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
});

export default mongoose.model("Category", CategorySchema);
