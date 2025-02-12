import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  phone: {
    type: String,
    requires: true,
  },
  email: {
    type: String,
    requires: true,
  },
  address: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ru: { type: String, required: true },
  },
  instagram: {
    type: String,
  },
  youtube: {
    type: String,
  },
  facebook: {
    type: String,
  },
});

export default mongoose.model("Contact", ContactSchema);
