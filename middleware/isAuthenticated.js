const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(400).json({ message: "Token not found" });
  }

  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET);
    req.user = tokenInfo; // Assign user information to req.user
    next(); // Continue to the next middleware
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
