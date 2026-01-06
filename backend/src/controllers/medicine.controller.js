import Medicine from "../models/Medicine.js";
import Pharmacy from "../models/Pharmacy.js";

/**
 * @desc    Create medicine (Pharmacy adds stock)
 * @route   POST /api/medicines
 * @access  Protected (pharmacy owner)
 */
export const createMedicine = async (req, res) => {
  try {
    const { name, brand, expiryDate, quantity, originalPrice } = req.body;

    if (
      !name ||
      !brand ||
      !expiryDate ||
      quantity === undefined ||
      originalPrice === undefined
    ) {
      return res.status(400).json({ message: "All medicine fields are required" });
    }

    // 🔥 Get pharmacy automatically from logged-in user
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({ message: "No pharmacy linked to this account" });
    }

    const medicine = await Medicine.create({
      name,
      brand,
      pharmacy: pharmacy._id,
      expiryDate,
      quantity,
      originalPrice,
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all medicines
 * @route   GET /api/medicines
 * @access  Public
 */
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .populate("pharmacy", "name address")
      .sort({ isNearExpiry: -1, expiryDays: 1, discountPercent: -1 });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Search medicines
 * @route   GET /api/medicines/search
 * @access  Public
 */
export const searchMedicines = async (req, res) => {
  try {
    const { q, nearExpiry, highDiscount } = req.query;
    let filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (nearExpiry === "true") filter.isNearExpiry = true;
    if (highDiscount === "true") filter.discountPercent = { $gte: 50 };

    const medicines = await Medicine.find(filter)
      .populate("pharmacy", "name address")
      .sort({ expiryDays: 1, discountPercent: -1 });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      "pharmacy",
      "name address"
    );

    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
