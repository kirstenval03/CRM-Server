const isSalesCoach = (req, res, next) => {
    const { isSalesCoach } = req.user;
  
    if (isSalesCoach) {
      next(); 
    } else {
      res.status(403).json({ message: "Access denied. You are not a Sales Coach." });
    }
  };
  
  module.exports = isSalesCoach;
  