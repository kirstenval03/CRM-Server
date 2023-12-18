const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
      next(); // Continue to next middleware if user is admin
  } else {
      res.status(403).json({ message: "Access denied. You are not an administrator." });
  }
};

module.exports = isAdmin;
