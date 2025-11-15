const jwt = require("jsonwebtoken");

/**
 * Standard authentication middleware:
 * Verifies JWT and attaches decoded payload to req.user.
 */
exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info (id, staff_id, role, etc.)
    req.user = decoded;
    req.role = decoded.role ? decoded.role.toLowerCase() : null;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

/**
 * Admin authentication middleware:
 * Same as authMiddleware, but also checks if the decoded token has role = 'admin'.
 */
exports.requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    // Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.role = decoded.role ? decoded.role.toLowerCase() : null;

    if (req.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    next();
  } catch (err) {
    console.error("requireAdmin error:", err.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
