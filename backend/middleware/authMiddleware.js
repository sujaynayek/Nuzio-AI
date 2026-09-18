const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getDBStatus } = require("../config/db");

// In-memory user cache for offline fallback
const memoryUsers = global._nuzio_memory_users || new Map();
global._nuzio_memory_users = memoryUsers;

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized to access this route. Token missing.",
      });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "nuzio_ai_secure_token_secret_key_2026_x89",
    );

    if (getDBStatus()) {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Check memory store
    if (memoryUsers.has(decoded.id)) {
      req.user = memoryUsers.get(decoded.id);
      return next();
    }

    return res.status(401).json({ success: false, message: "User not found" });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

module.exports = { protect, memoryUsers };
