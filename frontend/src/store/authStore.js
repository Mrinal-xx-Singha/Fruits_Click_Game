import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      });
      throw error;
    }
  },
  register: async (username, password) => {
    try {
      set({ isLoading: true, error: null });
      await api.post("/auth/register", {
        username,
        password,
      });
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Registration failed",
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ user: null, error: null });
    } catch (error) {
      console.error("Error logging out", error);
    }
  },
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data, error: null });
    } catch (error) {
      console.log(error);
      set({ user: null });
    }
  },
  clearError: () => set({ error: null }),
}));
