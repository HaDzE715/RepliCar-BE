const Brand = require("../models/Brand");
const Product = require("../models/Product");

// Get all brands or search by name
exports.getAllBrands = async (req, res) => {
  try {
    const name = req.query.name;
    let brands;
    if (name) {
      brands = await Brand.find({ name: new RegExp(name, "i") }); // Case-insensitive search
    } else {
      brands = await Brand.find();
    }
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create a new brand
exports.createBrand = async (req, res) => {
  const { name, founder, city, country, month, day, year, logo } = req.body;
  const brand = new Brand({
    name,
    founder,
    city,
    country,
    month,
    day,
    year,
    logo,
  });

  try {
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a brand by ID
exports.updateBrand = async (req, res) => {
  const { name, founder, city, country, month, day, year, logo } = req.body;
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name,
        founder,
        city,
        country,
        month,
        day,
        year,
        logo,
      },
      { new: true }
    );
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a brand by ID
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
