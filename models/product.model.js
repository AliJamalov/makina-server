import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      tr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      tr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    category: {
      en: { type: String, required: true },
      tr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
