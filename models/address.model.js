import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  city: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ru: { type: String, required: true },
  },
  address: {
    tr: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
    ru: { type: String, required: true },
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Address", AddressSchema);
