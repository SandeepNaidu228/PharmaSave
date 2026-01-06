import Order from "../models/Order.js";
import Medicine from "../models/Medicine.js";

/**
 * @desc    Create order (Reserve medicine)
 * @route   POST /api/orders
 * @access  Protected
 */
export const createOrder = async (req, res) => {
  try {
    const { medicineId, quantity } = req.body;

    if (!medicineId || !quantity) {
      return res.status(400).json({
        message: "Medicine and quantity are required",
      });
    }

    const medicine = await Medicine.findById(medicineId).populate("pharmacy");

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (medicine.quantity < quantity) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    // Reduce stock
    medicine.quantity -= quantity;
    await medicine.save();

    const order = await Order.create({
      user: req.user._id,
      pharmacy: medicine.pharmacy._id,
      medicine: medicine._id,
      quantity,
      status: "reserved",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/my
 * @access  Protected
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("medicine", "name brand discountedPrice expiryDays")
      .populate("pharmacy", "name address")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Protected
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["picked", "expired"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get orders for a pharmacy
 * @route   GET /api/orders/pharmacy/:pharmacyId
 * @access  Protected (pharmacy owner)
 */
export const getOrdersByPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const orders = await Order.find({ pharmacy: pharmacyId })
      .populate("medicine", "name brand")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Pharmacy orders error:", error);
    res.status(500).json({ message: "Failed to fetch pharmacy orders" });
  }
};
