const jwt = require("jsonwebtoken");

// 1) verifyToken: checks the JWT sent in the Authorization header
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization; // "Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// 2) verifyRole: runs AFTER verifyToken, allows only the given roles
const verifyRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You are not allowed to do this." });
  }
  next();
};

module.exports = { verifyToken, verifyRole };
