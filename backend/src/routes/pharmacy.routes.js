import express from "express";
import {
  createPharmacy,
  getNearbyPharmacies,
  getPharmacyById,
} from "../controllers/pharmacy.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create pharmacy
router.post("/", protect, createPharmacy);

// Get nearby pharmacies
router.get("/nearby", getNearbyPharmacies);

// Get pharmacy by ID
router.get("/:id", getPharmacyById);

export default router;
