const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token === "null") {
    return res.status(401).json({ error: "Authentication token missing" });
  }

  // Log the received token for debugging
  console.log("Received Token:", token);

  try {
    const tokenInfo = jwt.verify(token, process.env.SECRET);

    // Log the token information for debugging
    console.log("Token Info:", tokenInfo);

    req.user = tokenInfo; // Assign user information to req.user
    next(); // Continue to the next middleware
  } catch (error) {
    console.error("Error verifying token:", error);

    // Log the specific error for debugging
    console.error("Token Verification Error:", error);

    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = isAuthenticated;


