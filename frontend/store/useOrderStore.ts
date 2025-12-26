import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { orderAPI } from "../utils/api";

export type OrderStatus = "reserved" | "picked" | "expired";

export interface Order {
  _id: string;
  id?: string; // For backward compatibility
  medicine?: {
    _id: string;
    name: string;
    brand?: string;
    discountedPrice?: number;
    expiryDays?: number;
  };
  medicineName?: string;
  pharmacy?: {
    _id: string;
    name: string;
    address?: string;
  };
  quantity: number;
  status: OrderStatus;
  createdAt?: string;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (medicineId: string, quantity: number) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: "picked" | "expired") => Promise<void>;
}

// Helper to transform backend order to frontend format
const transformOrder = (order: any): Order => {
  return {
    _id: order._id,
    id: order._id, // For backward compatibility
    medicine: order.medicine,
    medicineName: order.medicine?.name || "Unknown Medicine",
    pharmacy: order.pharmacy,
    quantity: order.quantity,
    status: order.status,
    createdAt: order.createdAt,
  };
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await orderAPI.getMyOrders();
          const transformed = data.map(transformOrder);
          set({ orders: transformed, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch orders",
          });
        }
      },

      createOrder: async (medicineId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const data = await orderAPI.create(medicineId, quantity);
          const transformed = transformOrder(data);
          set((state) => ({
            orders: [transformed, ...state.orders],
            isLoading: false,
          }));
          return transformed;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to create order",
          });
          throw error;
        }
      },

      updateOrderStatus: async (orderId: string, status: "picked" | "expired") => {
        set({ isLoading: true, error: null });
        try {
          const data = await orderAPI.updateStatus(orderId, status);
          const transformed = transformOrder(data);
          set((state) => ({
            orders: state.orders.map((order) =>
              (order._id === orderId || order.id === orderId) ? transformed : order
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to update order",
          });
          throw error;
        }
      },
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
