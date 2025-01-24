import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };
};

// authenticate sockets

export const authenticateSocket = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Authentication required: No cookie provided"));
    }

    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]*)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      return next(
        new Error("Authentication rquired: Token not found in cookies")
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Check if the user exists and is not blocked
    if (!user || user.isBlocked) {
      return next(new Error("User not found or blocked"));
    }

    socket.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};
