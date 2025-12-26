import express from "express";
import cors from "cors";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import pharmacyRoutes from "./routes/pharmacy.routes.js";
import orderRoutes from "./routes/order.routes.js";

// Middleware imports
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// --------------------
// Global Middleware
// --------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development
  credentials: true,
}));
app.use(express.json());

// --------------------
// Health Check
// --------------------
app.get("/", (req, res) => {
  res.send("PharmaSave API running 🚀");
});

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/orders", orderRoutes);

// --------------------
// Error Handler (last)
// --------------------
app.use(errorHandler);

export default app;
