import Pharmacy from "../models/Pharmacy.js";

/**
 * @desc    Create pharmacy
 * @route   POST /api/pharmacies
 * @access  Protected (pharmacy owner)
 */
export const createPharmacy = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
      return res.status(400).json({
        message: "Name, address, latitude and longitude are required",
      });
    }

    const pharmacy = await Pharmacy.create({
      name,
      address,
      owner: req.user._id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.status(201).json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get nearby pharmacies
 * @route   GET /api/pharmacies/nearby
 * @access  Public
 */
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { latitude, longitude, distance = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: parseInt(distance),
        },
      },
    });

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get pharmacy by owner (logged-in user)
 * @route   GET /api/pharmacies/my
 * @access  Protected (pharmacy owner)
 */
export const getMyPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not linked to this account",
      });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get pharmacy by ID
 * @route   GET /api/pharmacies/:id
 * @access  Public
 */
export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        message: "Pharmacy not found",
      });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
