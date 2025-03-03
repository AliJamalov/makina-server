import HeroSection from "../../models/heroSection.model.js";
import cloudinary from "../../config/cloudinary.js";

export const createHeroSection = async (req, res) => {
  try {
    const { images } = req.body;
    console.log(req.body);

    if (!images || !images.en || !images.ru || !images.tr || !images.ar) {
      return res.status(400).json({ message: "Tüm diller için resim URL'leri sağlanmalıdır" });
    }

    const newHeroSection = new HeroSection({
      images: {
        en: images.en,
        ru: images.ru,
        tr: images.tr,
        ar: images.ar,
      },
    });

    const savedHeroSection = await newHeroSection.save();

    return res.status(201).json({
      message: "Hero Section başarıyla oluşturuldu",
      heroSection: savedHeroSection,
    });
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

    // Проверяем, есть ли изображения и являются ли они объектом
    if (heroSection.images && typeof heroSection.images === "object") {
      const regex = /\/v\d+\/(.*)\./;

      for (const lang in heroSection.images) {
        const imageUrl = heroSection.images[lang];

        // Проверяем, является ли imageUrl строкой
        if (typeof imageUrl === "string") {
          const match = imageUrl.match(regex);

          if (match && match[1]) {
            const publicId = match[1];

            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error(`Ошибка при удалении ${lang}-изображения из Cloudinary:`, err);
            }
          }
        } else {
          console.warn(`Некорректное значение imageUrl для языка ${lang}:`, imageUrl);
        }
      }
    } else {
      console.warn("Поле images отсутствует или не является объектом:", heroSection.images);
    }

    // Удаление документа из базы данных
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
