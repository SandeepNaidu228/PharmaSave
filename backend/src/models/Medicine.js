import mongoose from "mongoose";
import {
  calculateExpiryDays,
  calculateDiscount,
} from "../utils/expiry.utils.js";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    brand: {
      type: String,
      required: true,
    },

    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      required: true,
    },

    discountedPrice: {
      type: Number,
    },

    discountPercent: {
      type: Number,
    },

    expiryDays: {
      type: Number,
    },

    isNearExpiry: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * PRE-SAVE HOOK
 * Automatically calculate expiry & discount
 */
medicineSchema.pre("save", function (next) {
  const expiryDays = calculateExpiryDays(this.expiryDate);
  const discountPercent = calculateDiscount(expiryDays);

  this.expiryDays = expiryDays;
  this.discountPercent = discountPercent;

  this.discountedPrice =
    this.originalPrice -
    Math.round((this.originalPrice * discountPercent) / 100);

  this.isNearExpiry = expiryDays <= 30;

  next();
});

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
