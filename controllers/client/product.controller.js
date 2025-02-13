import Product from "../../models/product.model.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = "", lng = "tr" } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    if (isNaN(pageInt) || pageInt <= 0 || isNaN(limitInt) || limitInt <= 0) {
      return res
        .status(400)
        .json({ message: "Некорректные параметры пагинации" });
    }

    const skip = (pageInt - 1) * limitInt;

    // Формируем фильтр для поиска по полю title для указанного языка
    const searchFilter = search
      ? { [`title.${lng}`]: { $regex: search, $options: "i" } }
      : {};

    // Получаем данные с пагинацией и фильтром
    const [products, total] = await Promise.all([
      Product.find(searchFilter).skip(skip).limit(limitInt),
      Product.countDocuments(searchFilter),
    ]);

    res.status(200).json({
      total,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(total / limitInt),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};
