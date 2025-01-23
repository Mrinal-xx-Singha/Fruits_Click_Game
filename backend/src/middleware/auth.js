import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
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
    const token = socket.handshake.headers.cookie
      ?.split("token=")[1]
      ?.split(";")[0];
    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isBlocked) {
      return next(new Error("User not found or blocked"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
};
