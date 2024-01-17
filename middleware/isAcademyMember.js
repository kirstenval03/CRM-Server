const isAcademyMember = (req, res, next) => {
    if (req.user && req.user.role === 'academy_member') {
      next(); // Continue to the next middleware if user is an Academy Member
    } else {
      res.status(403).json({ message: "Access denied. You are not an Academy Member." });
    }
  };
  
  module.exports = isAcademyMember;
  