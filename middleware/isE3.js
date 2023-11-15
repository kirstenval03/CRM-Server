const isE3 = (req, res, next) => {
    const { isE3 } = req.user;
  
    if (isE3) {
      next(); 
    } else {
      res.status(403).json({ message: "Access denied. You are not a E3 team member." });
    }
  };
  
  module.exports = isE3;
  