import About from "../../models/about.model.js";

export const createAbout = async (req, res) => {
  try {
    const { text, image } = req.body;

    const newAbout = new About({
      text,
      image,
    });

    await newAbout.save();

    res.status(201).json({
      message: "About created successfully",
      about: newAbout,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating About",
      error: error.message,
    });
  }
};

export const getAllAbout = async (req, res) => {
  try {
    const abouts = await About.find();
    res.status(200).json(abouts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching About data",
      error: error.message,
    });
  }
};

export const getAboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching About data",
      error: error.message,
    });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    const { text, image } = req.body;

    about.text = text || about.text;
    about.image = image || about.image;

    await about.save();

    res.status(200).json({
      message: "About updated successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating About",
      error: error.message,
    });
  }
};

export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about) {
      return res.status(404).json({ message: "About not found" });
    }

    await about.remove();

    res.status(200).json({
      message: "About deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting About",
      error: error.message,
    });
  }
};
