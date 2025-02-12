import Product from "../../models/product.model.js";
import cloudinary from "../../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      model,
      pumpType,
      electricalSystem,
      sprayGun,
      images,
      orderNumber,
      workingPressure,
      waterFlowRate,
      power,
      voltage,
      rpm,
      operation,
      highPressureHose,
      dimensions,
      weight,
      code,
    } = req.body;
    if (
      !title ||
      !description ||
      !category ||
      !model ||
      !pumpType ||
      !electricalSystem ||
      !sprayGun ||
      !images ||
      !orderNumber ||
      !workingPressure ||
      !waterFlowRate ||
      !power ||
      !voltage ||
      !rpm ||
      !operation ||
      !highPressureHose ||
      !dimensions ||
      !weight ||
      !code
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      title,
      description,
      category,
      model,
      pumpType,
      electricalSystem,
      sprayGun,
      images,
      orderNumber,
      workingPressure,
      waterFlowRate,
      power,
      voltage,
      rpm,
      operation,
      highPressureHose,
      dimensions,
      weight,
      code,
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
    const {
      title,
      description,
      category,
      model,
      pumpType,
      electricalSystem,
      sprayGun,
      images,
      orderNumber,
      workingPressure,
      waterFlowRate,
      power,
      voltage,
      rpm,
      operation,
      highPressureHose,
      dimensions,
      weight,
      code,
    } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateLocalizedField = (field, newValue) => {
      if (newValue) {
        product[field].en = newValue.en || product[field].en;
        product[field].tr = newValue.tr || product[field].tr;
        product[field].ar = newValue.ar || product[field].ar;
        product[field].ru = newValue.ru || product[field].ru;
      }
    };

    updateLocalizedField("title", title);
    updateLocalizedField("description", description);
    updateLocalizedField("category", category);
    updateLocalizedField("model", model);
    updateLocalizedField("pumpType", pumpType);
    updateLocalizedField("electricalSystem", electricalSystem);
    updateLocalizedField("sprayGun", sprayGun);
    // Обновление остальных полей, если они есть
    if (orderNumber) product.orderNumber = orderNumber;
    if (workingPressure) product.workingPressure = workingPressure;
    if (waterFlowRate) product.waterFlowRate = waterFlowRate;
    if (power) product.power = power;
    if (voltage) product.voltage = voltage;
    if (rpm) product.rpm = rpm;
    if (operation) product.operation = operation;
    if (highPressureHose) product.highPressureHose = highPressureHose;
    if (dimensions) product.dimensions = dimensions;
    if (weight) product.weight = weight;
    if (code) product.code = code;

    // Обработка изображений
    if (images) {
      const imagesToDelete = product.images.filter(
        (image) => !images.includes(image)
      );

      for (let image of imagesToDelete) {
        const regex = /\/v\d+\/(.*)\./;
        const match = image.match(regex);

        if (match && match[1]) {
          const publicId = match[1];
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
          }
        }
      }

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
