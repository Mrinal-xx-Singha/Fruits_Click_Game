import { create } from "zustand";
import axios from "axios";
import { socket } from "../lib/Socket";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const useGameStore = create((set) => ({
  players: [],
  isLoading: false,
  error: null,

  // Fetch all players (admin only)
  fetchPlayers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/players");
      set({ players: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch players",
        isLoading: false,
      });
      console.error("Error fetching players:", error);
    }
  },

  // Update banana count
  updateBananaCount: (playerId) => {
    try {
      socket.emit("banana-click", { playerId });
    } catch (error) {
      console.log("Error emmiting banana click event:", error);
    }
  },

  // Toggle player block status (admin only)
  togglePlayerBlock: async (playerId, isBlocked) => {
    try {
      set({ isLoading: true, error: null });
      await api.patch(`/players/${playerId}/toggle-block`);

      // Update local state after successful toggle
      set((state) => ({
        players: state.players.map((player) =>
          player.id === playerId ? { ...player, isBlocked } : player
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to toggle player block status",
        isLoading: false,
      });
      console.error("Error toggling player block status:", error);
    }
  },

  // Reset error state
  clearError: () => set({ error: null }),

  initializeSocketListeners: () => {
    try {
      socket.on("banana-update", ({ id, bananaCount }) => {
        set((state) => ({
          players: state.players.map((player) =>
            player.id === id ? { ...player, bananaCount } : player
          ),
        }));
      });

      socket.on("player-status-change", ({ id, isOnline }) => {
        set((state) => ({
          players: state.players.map((player) =>
            player.id === id ? { ...player, isOnline } : player
          ),
        }));
      });
    } catch (error) {
      console.log("Error initializiong the socket listeners", error);
    }
  },

  // Cleanup socket listeners
  cleanup: () => {
    socket.off("banana-update");
    socket.off("player-status-change");
  },
}));
