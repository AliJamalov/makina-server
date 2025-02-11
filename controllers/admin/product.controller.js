import Product from "../../models/product.model.js";
import cloudinary from "../../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, images, category } = req.body;

    if (!category || !title || !description || !images) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      title: {
        en: title.en,
        tr: title.tr,
        ar: title.ar,
      },
      description: {
        en: description.en,
        tr: description.tr,
        ar: description.ar,
      },
      category: {
        en: category.en,
        tr: category.tr,
        ar: category.ar,
      },
      images,
    });

    const product = await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      for (let image of product.images) {
        // Используем регулярное выражение для извлечения правильного publicId
        const regex = /\/v\d+\/(.*)\./; // Ищем все после /v<version>/ и до точки
        const match = image.match(regex);

        if (match && match[1]) {
          const publicId = match[1]; // Извлекаем publicId

          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, category, images } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (title) {
      product.title.en = title.en || product.title.en;
      product.title.tr = title.tr || product.title.tr;
      product.title.ar = title.ar || product.title.ar;
    }

    if (description) {
      product.description.en = description.en || product.description.en;
      product.description.tr = description.tr || product.description.tr;
      product.description.ar = description.ar || product.description.ar;
    }

    if (category) {
      product.category.en = category.en || product.category.en;
      product.category.tr = category.tr || product.category.tr;
      product.category.ar = category.ar || product.category.ar;
    }

    // Обработка изображений
    if (images) {
      // Найдем изображения, которые нужно удалить
      const imagesToDelete = product.images.filter(
        (image) => !images.includes(image)
      );

      // Удалим изображения из Cloudinary, которые больше не используются
      for (let image of imagesToDelete) {
        // Используем регулярное выражение для извлечения правильного publicId
        const regex = /\/v\d+\/(.*)\./; // Ищем все после /v<version>/ и до точки
        const match = image.match(regex);

        if (match && match[1]) {
          const publicId = match[1]; // Извлекаем publicId

          try {
            const result = await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
          }
        }
      }

      // Обновим список изображений
      product.images = images;
    }

    // Сохранение обновленного продукта
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};
