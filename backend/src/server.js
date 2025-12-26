import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Start server
app.listen(PORT, "0.0.0.0",() => {
  console.log(`Server running on http://localhost:${PORT}`);
});
