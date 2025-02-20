import Order from "../../models/order.model.js";

export const createOrder = async (req, res) => {
  const { productId, message } = req.body;
  const userId = req.userId;

  try {
    if (!userId || !productId || !message) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const order = new Order({ userId, productId, message });
    await order.save();

    return res
      .status(201)
      .json({ message: "Order created successfully!", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Агрегируем заказы по пользователю
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users", // связываем с коллекцией пользователей
          localField: "userId", // связываем по userId
          foreignField: "_id",
          as: "userDetails", // добавляем подробности пользователя
        },
      },
      { $unwind: "$userDetails" }, // разворачиваем пользователя
      {
        $group: {
          _id: "$userId", // группируем по userId
          name: { $first: "$userDetails.name" }, // извлекаем имя пользователя
          email: { $first: "$userDetails.email" }, // извлекаем email пользователя
          phone: { $first: "$userDetails.phone" }, // извлекаем телефон
          orders: { $push: "$$ROOT" }, // собираем все заказы этого пользователя
        },
      },
      {
        $lookup: {
          from: "products", // связываем с коллекцией продуктов
          localField: "orders.productId", // связываем по productId
          foreignField: "_id",
          as: "orders.productDetails", // добавляем подробности о продукте
        },
      },
      {
        $unwind: {
          path: "$orders.productDetails",
          preserveNullAndEmptyArrays: true, // если не найден продукт, оставляем пустым
        },
      },
      {
        $group: {
          _id: "$_id", // группируем снова по userId
          name: { $first: "$name" },
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          orders: { $push: "$orders" }, // объединяем все заказы этого пользователя в массив
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          orders: {
            _id: 1,
            message: 1,
            "productDetails.title": 1,
            "productDetails.images": 1,
            "productDetails.code": 1,
          },
        },
      },
    ]);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersByUserIdForAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    // Получаем все заказы для конкретного пользователя и популяем информацию о продукте
    const orders = await Order.find({ userId })
      .populate("productId", "title images code") // Получаем поля title и image из модели Product
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Возвращаем все заказы с полными данными о продукте
    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await Order.find({ userId })
      .populate("productId", "title images")
      .exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
