import HeroSection from "../../models/heroSection.model.js";
import cloudinary from "../../config/cloudinary.js";

export const createHeroSection = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Resim URL'si sağlanmadı" });
    }

    const newHeroSection = new HeroSection({
      image: imageUrl,
    });

    const savedHeroSection = await newHeroSection.save();

    if (savedHeroSection) {
      return res
        .status(201)
        .json({ message: "Hero Section başarıyla oluşturuldu" });
    }
  } catch (error) {
    console.error("Hero Section oluşturulurken hata:", error);
    return res.status(500).json({
      message: "Hero Section oluşturulurken hata",
      error: error.message,
    });
  }
};

export const getAllHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find();
    if (!heroSections) {
      return res.status(404).json({ message: "images not found" });
    }
    res.status(200).json(heroSections);
  } catch (error) {
    console.error("Error fetching Hero Sections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteHeroSection = async (req, res) => {
  try {
    const heroSectionId = req.params.id;

    const heroSection = await HeroSection.findById(heroSectionId);

    if (!heroSection) {
      return res.status(404).json({ message: "Hero Section not found" });
    }

    if (heroSection.image) {
      const regex = /\/v\d+\/(.*)\./;
      const match = heroSection.image.match(regex);

      if (match && match[1]) {
        const publicId = match[1];

        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting image from Cloudinary:", err);
        }
      }
    }

    await HeroSection.findByIdAndDelete(heroSectionId);
    res.status(200).json({
      message: "Hero Section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Hero Section",
      error: error.message,
    });
  }
};
