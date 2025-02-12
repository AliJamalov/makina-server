import mongoose from "mongoose";

const localizedStringSchema = {
  en: { type: String, required: true },
  tr: { type: String, required: true },
  ar: { type: String, required: true },
  ru: { type: String, required: true },
};

const productSchema = new mongoose.Schema(
  {
    title: localizedStringSchema,
    description: localizedStringSchema,
    category: localizedStringSchema,
    model: localizedStringSchema, // Model
    pumpType: localizedStringSchema, // Pompa Tipi
    electricalSystem: localizedStringSchema, // Elektrik Donanımı
    sprayGun: localizedStringSchema, // Püskürtme Tabancası
    images: {
      type: [String],
      required: true,
    },
    orderNumber: { type: String, required: true }, // Sipariş No
    workingPressure: { type: String, required: true }, // Çalışma Basıncı
    waterFlowRate: { type: String, required: true }, // Su Debisi
    power: { type: String, required: true }, // Güç
    voltage: { type: String, required: true }, // Voltaj
    rpm: { type: String, required: true }, // Devir
    operation: { type: String, required: true }, // Çalışма
    highPressureHose: { type: String, required: true }, // Yüksek Basınç Hortumu
    dimensions: { type: String, required: true }, // Ebat (En x Boy x Yükseklik)
    weight: { type: String, required: true }, // Ağırlık
    code: { type: String, required: true }, // Code
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
