import User from "../models/User.js";

export const setupSocketHandlers = (io) => {
  io.on("connection", async (socket) => {
    try {
      // Validate user from the socket
      if (!socket.user || !socket.user.id) {
        console.error("Invalid socket user: user ID is missing.");
        return socket.disconnect(true); // Disconnect if user data is invalid
      }

      const userId = socket.user.id;

      // Update user's online status
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("player-status-change", { id: userId, isOnline: true });

      // Handle banana clicks
      socket.on("banana-click", async () => {
        try {
          const user = await User.findByIdAndUpdate(
            socket.user.id,
            { $inc: { bananaCount: 1 } },
            { new: true }
          );
          if (!user) {
            console.error(`User not found: ${userId}`);
            return;
          }

          // Emit updated banana count to all clients
          io.emit("banana-update", {
            id: user._id,
            bananaCount: user.bananaCount,
          });

          // Update leaderboard
          const leaderboard = await User.find({ role: "player" })
            .select("username bananaCount isOnline")
            .sort('-bananaCount')
            .limit(10);

          io.emit("leaderboard-update", leaderboard);
        } catch (error) {
          console.error("Error handling banana click:", error);
        }
      });

      // Handle disconnection
      socket.on("disconnect", async () => {
        try {
          if (!userId) {
            console.error("Disconnect event: Missing user ID.");
            return;
          }

          await User.findByIdAndUpdate(socket.user.id, { isOnline: false });
          io.emit("player-status-change", {
            id: userId,
            isOnline: false,
          });
        } catch (error) {
          console.error("Error handling disconnect:", error);
        }
      });
    } catch (error) {
      console.error("Error in socket connection:", error);
    }
  });
};
