const isSalesCoach = (req, res, next) => {
  if (req.user && req.user.role === 'sales_coach') {
    next(); // Continue to the next middleware if user is a Sales Coach
  } else {
    res.status(403).json({ message: "Access denied. You are not a Sales Coach." });
  }
};

module.exports = isSalesCoach;

  