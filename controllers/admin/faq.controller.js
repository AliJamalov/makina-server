import Faq from "../../models/faq.model.js";

export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ не найден" });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const createFaq = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newFaq = new Faq({ title, content });
    await newFaq.save();
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFaq) {
      return res.status(404).json({ message: "FAQ не найден" });
    }
    res.status(200).json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ message: "FAQ не найден" });
    }
    res.status(200).json({ message: "FAQ удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
