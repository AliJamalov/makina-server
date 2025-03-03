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

    return res.status(201).json({ message: "Order created successfully!", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: "$userId",
          name: { $first: "$userDetails.name" },
          email: { $first: "$userDetails.email" },
          phone: { $first: "$userDetails.phone" },
          orders: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orders.productId",
          foreignField: "_id",
          as: "orders.productDetails",
        },
      },
      {
        $unwind: {
          path: "$orders.productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          orders: { $push: "$orders" },
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
    const orders = await Order.find({ userId }).populate("productId", "title images code").exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Order.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    return res.status(200).json({ message: "Kullanıcının tüm siparişleri silindi" });
  } catch (error) {
    console.error("Hata:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await Order.find({ userId }).populate("productId", "title images").exec();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
