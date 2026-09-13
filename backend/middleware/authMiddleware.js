const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the user to req.user - used on any route that needs a logged-in user
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized, invalid or expired token" });
  }
};

// Used after `protect` on admin-only routes (e.g. approve payments, revoke access, manage courses)
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// For routes that work whether or not the visitor is logged in (e.g. course detail page).
// If a valid token is present, req.user is set and the controller can check enrollment.
// If not, req.user stays undefined and the controller treats the visitor as a guest - no error either way.
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }
  } catch (err) {
    // invalid/expired token on an optional route - just proceed as a guest instead of erroring
  }
  next();
};
