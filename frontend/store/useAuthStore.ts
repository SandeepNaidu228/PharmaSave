import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authAPI } from "../utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          set({
            user: {
              _id: response._id,
              name: response.name,
              email: response.email,
              role: response.role,
            },
            token: response.token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Login failed",
            isLoggedIn: false,
          });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, role?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(name, email, password, role);
          set({
            user: {
              _id: response._id,
              name: response.name,
              email: response.email,
              role: response.role,
            },
            token: response.token,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || "Registration failed",
            isLoggedIn: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          error: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoggedIn: false });
          return;
        }

        try {
          const user = await authAPI.getMe();
          set({
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
            isLoggedIn: true,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isLoggedIn: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
