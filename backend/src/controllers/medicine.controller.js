import Medicine from "../models/Medicine.js";
import Pharmacy from "../models/Pharmacy.js";

/**
 * @desc    Create medicine (Pharmacy adds stock)
 * @route   POST /api/medicines
 * @access  Protected (pharmacy owner)
 */
export const createMedicine = async (req, res) => {
  try {
    const {
      name,
      brand,
      pharmacy,
      expiryDate,
      quantity,
      originalPrice,
    } = req.body;

    if (
      !name ||
      !brand ||
      !pharmacy ||
      !expiryDate ||
      !quantity ||
      !originalPrice
    ) {
      return res.status(400).json({
        message: "All medicine fields are required",
      });
    }

    // Ensure pharmacy exists
    const pharmacyExists = await Pharmacy.findById(pharmacy);
    if (!pharmacyExists) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    const medicine = await Medicine.create({
      name,
      brand,
      pharmacy,
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
 * @desc    Get all medicines (prioritize near-expiry)
 * @route   GET /api/medicines
 * @access  Public
 */
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .populate("pharmacy", "name address")
      .sort({
        isNearExpiry: -1,   // near-expiry first
        expiryDays: 1,      // fewer days first
        discountPercent: -1 // higher discount first
      });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Search medicines by name + filters
 * @route   GET /api/medicines/search
 * @access  Public
 */
export const searchMedicines = async (req, res) => {
  try {
    const { q, nearExpiry, highDiscount } = req.query;

    let filter = {};

    // Text search
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    // Near expiry filter
    if (nearExpiry === "true") {
      filter.isNearExpiry = true;
    }

    // High discount filter
    if (highDiscount === "true") {
      filter.discountPercent = { $gte: 50 };
    }

    const medicines = await Medicine.find(filter)
      .populate("pharmacy", "name address")
      .sort({
        expiryDays: 1,
        discountPercent: -1,
      });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single medicine by ID
 * @route   GET /api/medicines/:id
 * @access  Public
 */
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      "pharmacy",
      "name address"
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
