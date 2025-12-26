import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { medicineAPI } from "../utils/api";

export interface Medicine {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  brand: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  expiryDays: number;
  pharmacy?: {
    _id: string;
    name: string;
    address?: string;
  };
  pharmacyName?: string;
  distance?: string;
  quantity?: number;
  isNearExpiry?: boolean;
}

interface MedicineState {
  medicines: Medicine[];
  saved: Medicine[];
  isLoading: boolean;
  error: string | null;
  fetchMedicines: () => Promise<void>;
  searchMedicines: (query?: string, nearExpiry?: boolean, highDiscount?: boolean) => Promise<void>;
  toggleSave: (medicine: Medicine) => void;
  isSaved: (id: string) => boolean;
}

// Helper to transform backend medicine to frontend format
const transformMedicine = (medicine: any): Medicine => {
  return {
    _id: medicine._id,
    id: medicine._id, // For backward compatibility
    name: medicine.name,
    brand: medicine.brand,
    originalPrice: medicine.originalPrice,
    discountedPrice: medicine.discountedPrice,
    discountPercent: medicine.discountPercent,
    expiryDays: medicine.expiryDays,
    pharmacy: medicine.pharmacy,
    pharmacyName: medicine.pharmacy?.name || "Unknown Pharmacy",
    distance: "N/A", // Could be calculated based on user location
    quantity: medicine.quantity,
    isNearExpiry: medicine.isNearExpiry,
  };
};

export const useMedicineStore = create<MedicineState>()(
  persist(
    (set, get) => ({
      medicines: [],
      saved: [],
      isLoading: false,
      error: null,

      fetchMedicines: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await medicineAPI.getAll();
          const transformed = data.map(transformMedicine);
          set({ medicines: transformed, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Failed to fetch medicines",
          });
        }
      },

      searchMedicines: async (query?: string, nearExpiry?: boolean, highDiscount?: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const data = await medicineAPI.search(query, nearExpiry, highDiscount);
          const transformed = data.map(transformMedicine);
          set({ medicines: transformed, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Search failed",
          });
        }
      },

      toggleSave: (medicine) => {
        const exists = get().saved.find((m) => m._id === medicine._id || m.id === medicine.id);
        if (exists) {
          set({ saved: get().saved.filter((m) => m._id !== medicine._id && m.id !== medicine.id) });
        } else {
          set({ saved: [...get().saved, medicine] });
        }
      },

      isSaved: (id) => get().saved.some((m) => m._id === id || m.id === id),
    }),
    {
      name: "medicine-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        saved: state.saved,
      }),
    }
  )
);
