import express from "express";
import {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  searchMedicines,
} from "../controllers/medicine.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add medicine (pharmacy)
router.post("/", protect, createMedicine);

// Get all medicines
router.get("/", getAllMedicines);

// Search medicines
router.get("/search", searchMedicines);

// Get medicine by ID
router.get("/:id", getMedicineById);

export default router;
