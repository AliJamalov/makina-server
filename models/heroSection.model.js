import mongoose from "mongoose";

const HeroSectionSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model("HeroSection", HeroSectionSchema);
