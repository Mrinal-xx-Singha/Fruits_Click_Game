import User from "../models/User.js";

export const setupSocketHandlers = (io) => {
  io.on("connection", async (socket) => {
    try {
      // Update user's online status
      await User.findByIdAndUpdate(socket.user.id, {
        isOnline: true,
      });
      io.emit("player-status-change", { id: socket.user.id, isOnline: true });

      // Handle banana clicks
      socket.on("banana-click", async () => {
        try {
          const user = await User.findByIdAndUpdate(
            socket.user.id,
            { $inc: { bananaCount: 1 } },
            { new: true }
          );
          //Emit updated banana count to all clients
          io.emit("banana-update", {
            id: user._id,
            bananaCount: user.bananaCount,
          });
          // Update leaderboard
          const leaderboard = await User.find({
            role: "player",
          })
            .select("username bananaCount isOnline")
            .sort("-bananaCount")
            .limit(10);

          io.emit("leaderboard-update", leaderboard);
        } catch (error) {
          console.error("Error handling banana click:", error);
        }
      });

      // Handle disconnection
      socket.on("disconnect", async () => {
        try {
          await User.findByIdAndUpdate(socket.user.id, {
            isOnline: false,
          });
          io.emit("player-status-change", {
            id: socket.user.id,
            isOnline: false,
          });
        } catch (error) {
          console.error("Error handling disconnect", error);
        }
      });
    } catch (error) {
      console.log("Error in socket connection", error);
    }
  });
};
