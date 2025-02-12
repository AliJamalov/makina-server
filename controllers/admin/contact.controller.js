import Contact from "../../models/contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { phone, email, address, instagram, youtube, facebook } = req.body;

    const contact = new Contact({
      phone,
      email,
      address: {
        tr: address.tr,
        en: address.en,
        ar: address.ar,
        ru: address.ru,
      },
      instagram: instagram || undefined,
      youtube: youtube || undefined,
      facebook: facebook || undefined,
    });

    await contact.save();
    res.status(201).json({ message: "Contact created successfully", contact });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Error creating contact", error });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contacts", error });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Error fetching contact", error });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updateFields = {};

    if (updatedData.phone) updateFields.phone = updatedData.phone;
    if (updatedData.email) updateFields.email = updatedData.email;

    // Обработка обновлений для address (все переводы)
    if (updatedData.address) {
      updateFields.address = {
        tr: updatedData.address.tr || undefined,
        en: updatedData.address.en || undefined,
        ar: updatedData.address.ar || undefined,
        ru: updatedData.address.ru || undefined,
      };
    }

    if (updatedData.instagram) updateFields.instagram = updatedData.instagram;
    if (updatedData.youtube) updateFields.youtube = updatedData.youtube;
    if (updatedData.facebook) updateFields.facebook = updatedData.facebook;

    const contact = await Contact.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact updated successfully", contact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Error updating contact", error });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully", contact });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Error deleting contact", error });
  }
};
