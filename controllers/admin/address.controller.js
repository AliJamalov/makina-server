import Address from "../../models/address.model.js";

export const getAddresses = async (req, res) => {
  try {
    const { lng = "tr", page = 1, limit = 15, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Динамический поиск по указанному языку
    const query = search
      ? {
          $or: [
            { [`city.${lng}`]: { $regex: search, $options: "i" } },
            { [`address.${lng}`]: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [addresses, total] = await Promise.all([
      Address.find(query).skip(skip).limit(parseInt(limit)),
      Address.countDocuments(query),
    ]);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Adres bulunamadı" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

export const createAddress = async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(400).json({ message: "Geçersiz veri", error });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAddress) {
      return res.status(404).json({ message: "Adres bulunamadı" });
    }
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(400).json({ message: "Geçersiz veri", error });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ message: "Adres bulunamadı" });
    }
    res.status(200).json({ message: "Adres başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};
