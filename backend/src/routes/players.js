import express from "express";
import { authenticate, authroize } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get all players (admin only)

router.get("/", authenticate, authroize(["admin"]), async (req, res) => {
  try {
    const players = await User.find({ role: "player" })
      .select("-password")
      .sort("-bananaCount");
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: "Error fetching players" });
  }
});

// Toggle player block status (admin only)
router.patch(
  "/:id/toggle-block",
  authenticate,
  authroize(["admin"]),
  async (req, res) => {
    try {
      const player = await User.findById(req.params.id);

      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      player.isBlocked = !player.isBlocked;
      await player.save();

      res.json({
        message: "Player block status updated",
        isBlocked: player.isBlocked,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating player" });
    }
  }
);

// Get leaderboard
router.get("/leaderboard", authenticate, async (req, res) => {
  try {
    const leaderboard = await User.find({ role: "player" })
      .select("username bananaCount isOnline")
      .sort("-bananaCount")
      .limit(10);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});
export default router;
